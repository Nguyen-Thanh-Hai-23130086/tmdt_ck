import {db} from '../lib/db.js';
import {sendAccountEmail} from '../lib/mail.js';
import {randomToken,sha} from '../lib/security.js';

const MIN_INTERVAL_MS=60_000;
const WINDOW_MS=60*60_000;
const MAX_IN_WINDOW=5;

// Existing EmailToken.createdAt and indexes suffice; no database migration required.
// Throttling also happens at the HTTP/IP level. No token appears in logs.
export async function deliverAccountToken(user,purpose,{initial=false}={}){
  if(!['VERIFY','RESET'].includes(purpose))throw new Error('Unsupported token purpose');
  // Serialize token issuance for the same account using PostgreSQL row locking.
  // Prevents simultaneous resend requests from bypassing the per-account cooldown.
  const issued=await db.$transaction(async tx=>{
    await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${user.id} FOR UPDATE`;
    if(!initial){
      const recent=await tx.emailToken.findFirst({where:{userId:user.id,purpose},orderBy:{createdAt:'desc'}});
      if(recent && Date.now()-recent.createdAt.getTime()<MIN_INTERVAL_MS)return {skipped:'cooldown'};
      const count=await tx.emailToken.count({where:{userId:user.id,purpose,createdAt:{gt:new Date(Date.now()-WINDOW_MS)}}});
      if(count>=MAX_IN_WINDOW)return {skipped:'limit'};
    }
    const token=randomToken();
    const expiresAt=new Date(Date.now()+(purpose==='VERIFY'?24*60:30)*60_000);
    const record=await tx.emailToken.create({data:{userId:user.id,purpose,tokenHash:sha(token),expiresAt}});
    return {token,record};
  });
  if(issued.skipped)return {sent:false,reason:issued.skipped};
  const {token,record}=issued;
  try{
    const receipt=await sendAccountEmail(user.email,purpose,token);
    return {sent:true,provider:receipt.provider};
  }catch(error){
    // Preserve a newly registered account while allowing another delivery attempt.
    await db.emailToken.deleteMany({where:{id:record.id}}).catch(()=>{});
    console.error('[account-email] provider failed:',error?.code||error?.name||'delivery_error');
    return {sent:false,reason:'provider'};
  }
}
