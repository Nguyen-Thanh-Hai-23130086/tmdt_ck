import {db} from '../lib/db.js';
import {fail} from '../lib/errors.js';
import {sha,TOKEN_COOKIE} from '../lib/security.js';
export async function identify(req,res,next) {
  try {
    const token=req.cookies?.[TOKEN_COOKIE];
    if(token){
      const session=await db.session.findUnique({where:{tokenHash:sha(token)},include:{user:true}});
      if(session && session.expiresAt>new Date() && !session.user.locked){
        req.user=session.user;
      }
    }
    next();
  }catch(e){next(e)}
}
export function auth(req,res,next){
  if(!req.user) return next(new ErrorWithStatus(401,'Bạn cần đăng nhập'));
  next();
}
class ErrorWithStatus extends Error {constructor(status,message){super(message);this.status=status}}
export const roles = (...allowed) => (req,res,next) => {
  if(!req.user) return next(new ErrorWithStatus(401,'Bạn cần đăng nhập'));
  if(!allowed.includes(req.user.role)) return next(new ErrorWithStatus(403,'Bạn không có quyền thực hiện'));
  next();
};
export const selfOrAdmin = (user, target) => {if(user.id!==target && user.role!=='ADMIN') fail(403,'Bạn không có quyền truy cập')};
