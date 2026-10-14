import crypto from 'node:crypto';
import {db} from './db.js';
export const TOKEN_COOKIE = 'tm_session';
export const sha = s => crypto.createHash('sha256').update(s).digest('hex');
export const randomToken = () => crypto.randomBytes(32).toString('base64url');
const prod = process.env.NODE_ENV === 'production';
export const cookieOptions = {httpOnly:true, secure:prod, sameSite:'lax', path:'/'};
export async function makeSession(userId, res) {
  const token=randomToken();
  const expiresAt = new Date(Date.now()+7*86400000);
  await db.session.create({data:{userId,tokenHash:sha(token),expiresAt}});
  res.cookie(TOKEN_COOKIE,token,{...cookieOptions,expires:expiresAt});
}
export async function endSession(req,res) {
  const token=req.cookies?.[TOKEN_COOKIE];
  if(token) await db.session.deleteMany({where:{tokenHash:sha(token)}});
  res.clearCookie(TOKEN_COOKIE,cookieOptions);
}
