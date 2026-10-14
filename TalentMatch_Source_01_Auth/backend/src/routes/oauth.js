import {Router} from 'express';
import crypto from 'node:crypto';
import {createRemoteJWKSet,jwtVerify} from 'jose';
import {db} from '../lib/db.js';
import {randomToken,sha,cookieOptions,makeSession} from '../lib/security.js';
import {wrap,fail} from '../lib/errors.js';
import {deliverAccountToken} from '../services/accountEmail.js';
const router=Router();
const config={
  google:{id:process.env.GOOGLE_CLIENT_ID,secret:process.env.GOOGLE_CLIENT_SECRET},
  facebook:{id:process.env.FACEBOOK_APP_ID,secret:process.env.FACEBOOK_APP_SECRET}
};
const frontend=()=>process.env.FRONTEND_URL||'http://localhost:5173';
const backend=()=>process.env.BACKEND_URL||'http://localhost:4000';
const fbVersion=()=>process.env.FACEBOOK_API_VERSION||'v22.0';
const redirect=(provider)=>`${backend()}/api/oauth/${provider}/callback`;
const jwks=createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
router.get('/status',(req,res)=>res.json({google:!!(config.google.id&&config.google.secret),facebook:!!(config.facebook.id&&config.facebook.secret)}));
router.get('/:provider/start',wrap(async(req,res)=>{
  const provider=req.params.provider;
  if(!['google','facebook'].includes(provider)) fail(404,'Nhà cung cấp không hỗ trợ');
  if(!config[provider].id || !config[provider].secret) fail(503,`Chưa cấu hình OAuth ${provider}`);
  const linking=req.query.link==='1';
  if(linking&&(!req.user||req.user.role==='ADMIN')) fail(401,'Vui lòng đăng nhập bằng tài khoản Client/Freelancer để liên kết');
  const role=linking?req.user.role:req.query.role==='FREELANCER'?'FREELANCER':'CLIENT';
  const state=randomToken(),verifier=provider==='google'?JSON.stringify({pkce:randomToken(),nonce:randomToken()}):null;
  await db.oAuthState.create({data:{stateHash:sha(state),provider,role,verifier,linkUserId:linking?req.user.id:null,expiresAt:new Date(Date.now()+10*60*1000)}});
  res.cookie(`tm_oauth_${provider}`,state,{...cookieOptions,maxAge:10*60*1000});
  const redirectUri=redirect(provider);
  if(provider==='google'){
    const u=new URL('https://accounts.google.com/o/oauth2/v2/auth');
    const params={client_id:config.google.id,redirect_uri:redirectUri,response_type:'code',scope:'openid email profile',state,code_challenge:crypto.createHash('sha256').update(JSON.parse(verifier).pkce).digest('base64url'),code_challenge_method:'S256',nonce:JSON.parse(verifier).nonce,prompt:'select_account'};
    Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,v));
    return res.redirect(u.toString());
  }
  const u=new URL(`https://www.facebook.com/${fbVersion()}/dialog/oauth`);
  Object.entries({client_id:config.facebook.id,redirect_uri:redirectUri,response_type:'code',scope:'public_profile,email',state}).forEach(([k,v])=>u.searchParams.set(k,v));
  res.redirect(u.toString());
}));
async function exchangeGoogle(code,verifier){
  let secrets;
  try{secrets=JSON.parse(verifier)}catch{fail(401,'Phiên Google không hợp lệ')}
  if(!secrets?.pkce||!secrets?.nonce)fail(401,'Phiên Google không hợp lệ');
  const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({code,client_id:config.google.id,client_secret:config.google.secret,redirect_uri:redirect('google'),grant_type:'authorization_code',code_verifier:secrets.pkce}),signal:AbortSignal.timeout(10000)});
  if(!response.ok) fail(401,'Google từ chối mã xác thực');
  const data=await response.json();
  if(!data.id_token) fail(401,'Google không trả về định danh');
  const {payload}=await jwtVerify(data.id_token,jwks,{issuer:['https://accounts.google.com','accounts.google.com'],audience:config.google.id});
  if(payload.nonce!==secrets.nonce || !Number.isFinite(payload.exp) || payload.exp*1000<=Date.now() || !payload.sub || !payload.email || !payload.email_verified) fail(401,'Email Google chưa được xác minh');
  return {id:payload.sub,email:payload.email.toLowerCase(),name:payload.name||payload.email.split('@')[0],emailVerified:true};
}
async function exchangeFacebook(code){
  const params=new URLSearchParams({client_id:config.facebook.id,client_secret:config.facebook.secret,redirect_uri:redirect('facebook'),code});
  const tokenResponse=await fetch(`https://graph.facebook.com/${fbVersion()}/oauth/access_token?${params}`,{signal:AbortSignal.timeout(10000)});
  if(!tokenResponse.ok) fail(401,'Facebook từ chối mã xác thực');
  const token=(await tokenResponse.json()).access_token;
  if(!token) fail(401,'Không nhận được access token');
  const debug=new URLSearchParams({input_token:token,access_token:`${config.facebook.id}|${config.facebook.secret}`});
  const r=await fetch(`https://graph.facebook.com/${fbVersion()}/debug_token?${debug}`,{signal:AbortSignal.timeout(10000)});
  if(!r.ok) fail(401,'Không xác minh được tài khoản Facebook');
  const decoded=(await r.json()).data;
  if(!decoded?.is_valid || String(decoded.app_id)!==String(config.facebook.id) || !decoded.user_id || (decoded.expires_at>0 && decoded.expires_at*1000<=Date.now())) fail(401,'Token Facebook không hợp lệ');
  const proof=crypto.createHmac('sha256',config.facebook.secret).update(token).digest('hex');
  const userResponse=await fetch(`https://graph.facebook.com/${fbVersion()}/me?${new URLSearchParams({fields:'id,name,email',access_token:token,appsecret_proof:proof})}`,{signal:AbortSignal.timeout(10000)});
  if(!userResponse.ok) fail(401,'Không nhận được hồ sơ Facebook');
  const user=await userResponse.json();
  if(String(user.id)!==String(decoded.user_id)) fail(401,'Facebook ID không khớp');
  // An existing linked identity can still sign in if Facebook later omits email.
  // Only creating an unlinked account requires an email we can verify ourselves.
  return {id:user.id,email:user.email?.toLowerCase()||null,name:user.name||'Freelancer',emailVerified:false};
}
router.get('/:provider/callback',async(req,res)=>{
  try{
  const provider=req.params.provider;
  if(!['google','facebook'].includes(provider)) fail(404,'Nhà cung cấp không hỗ trợ');
  const state=String(req.query.state||'');
  const cookie=req.cookies?.[`tm_oauth_${provider}`];
  res.clearCookie(`tm_oauth_${provider}`,cookieOptions);
  if(!state || !cookie || state!==cookie) fail(401,'Phiên OAuth không hợp lệ hoặc đã hết hạn');
  const record=await db.oAuthState.findUnique({where:{stateHash:sha(state)}});
  if(!record || record.provider!==provider || record.expiresAt<new Date()) fail(401,'Phiên OAuth đã hết hạn');
  const consumed=await db.oAuthState.deleteMany({where:{stateHash:record.stateHash}});
  if(consumed.count!==1)fail(401,'Phiên OAuth đã được sử dụng');
  if(req.query.error || !req.query.code) return res.redirect(`${frontend()}/login?oauth=cancelled`);
  const identity=provider==='google'?await exchangeGoogle(String(req.query.code),record.verifier):await exchangeFacebook(String(req.query.code));
  if(record.linkUserId){
    if(!req.user||req.user.id!==record.linkUserId||req.user.locked)fail(401,'Phiên liên kết không hợp lệ');
    const already=await db.oAuthAccount.findUnique({where:{provider_providerUserId:{provider,providerUserId:identity.id}}});
    if(already&&already.userId!==req.user.id)fail(409,'Định danh OAuth đã liên kết với tài khoản khác');
    if(!already)await db.oAuthAccount.create({data:{provider,providerUserId:identity.id,userId:req.user.id}});
    return res.redirect(`${frontend()}/profile?linked=${provider}`);
  }
  const existing=await db.oAuthAccount.findUnique({where:{provider_providerUserId:{provider,providerUserId:identity.id}},include:{user:true}});
  let user;
  if(existing){user=existing.user; if(user.locked) fail(403,'Tài khoản đã bị khóa');}
  else {
    // Never merge accounts based only on matching email.
    if(!identity.email) fail(409,'Facebook không cung cấp email');
    if(await db.user.findUnique({where:{email:identity.email}})) return res.redirect(`${frontend()}/login?oauth=existing_email`);
    user=await db.user.create({data:{email:identity.email,fullName:identity.name,role:record.role,emailVerifiedAt:identity.emailVerified?new Date():null,freelancer:record.role==='FREELANCER'?{create:{headline:'Freelancer'}}:undefined,oauthAccounts:{create:{provider,providerUserId:identity.id}}}});
  }
  // Facebook's /me email is not a verified-email assertion. Require mailbox proof
  // before issuing a session; Google explicitly provides email_verified in its ID token.
  if(!user.emailVerifiedAt){
    await deliverAccountToken(user,'VERIFY');
    return res.redirect(`${frontend()}/check-email?email=${encodeURIComponent(user.email)}&oauth=verify_required`);
  }
  await makeSession(user.id,res);
  res.redirect(`${frontend()}/dashboard`);
  }catch(error){
    if(error?.status>=500 || !error?.status)console.error('[oauth callback failed]',error?.name||'unexpected');
    const reason=error?.status===409?(error.message?.includes('đã liên kết')?'already_linked':'missing_email'):error?.status===403?'blocked':'failed';
    res.redirect(`${frontend()}/login?oauth=${reason}`);
  }
});
export default router;
