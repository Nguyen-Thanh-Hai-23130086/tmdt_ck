import {Router} from 'express';
import bcrypt from 'bcryptjs';
import {z} from 'zod';
import {db} from '../lib/db.js';
import {fail,wrap} from '../lib/errors.js';
import {makeSession,endSession,sha} from '../lib/security.js';
import {deliverAccountToken} from '../services/accountEmail.js';
import {auth} from '../middleware/auth.js';

const router=Router();
const publicUser=u=>({id:u.id,email:u.email,fullName:u.fullName,role:u.role,avatarUrl:u.avatarUrl,location:u.location,bio:u.bio,emailVerified:!!u.emailVerifiedAt});
const email=z.string().trim().email().max(255).transform(s=>s.toLowerCase());
const password=z.string().min(10).max(100).refine(value=>/\p{L}/u.test(value)&&/\p{N}/u.test(value),'Mật khẩu phải có ít nhất một chữ cái và một chữ số');
const registerSchema=z.object({fullName:z.string().trim().min(2).max(90),email,password,role:z.enum(['CLIENT','FREELANCER']),agreed:z.literal(true)});
const genericVerify='Nếu tài khoản cần xác minh và được phép nhận thư, yêu cầu đã được xử lý. Hãy kiểm tra hộp thư và thử lại sau ít phút nếu cần.';
const genericReset='Nếu email có tài khoản hợp lệ, yêu cầu sẽ được xử lý. Hãy kiểm tra hộp thư và thử lại sau ít phút nếu cần.';

router.post('/register',wrap(async(req,res)=>{
  const data=registerSchema.parse(req.body);
  const passwordHash=await bcrypt.hash(data.password,12);
  const user=await db.user.create({data:{fullName:data.fullName,email:data.email,passwordHash,role:data.role,freelancer:data.role==='FREELANCER'?{create:{headline:'Freelancer'}}:undefined}});
  const receipt=await deliverAccountToken(user,'VERIFY',{initial:true});
  // Even if the mail provider fails, the account remains pending and can retry via resend.
  res.status(201).json({requiresVerification:true,emailSent:receipt.sent,message:receipt.sent?
    'Máy chủ gửi thư đã tiếp nhận liên kết xác minh. Hãy kiểm tra hộp thư.':
    'Tài khoản đã được tạo nhưng chưa gửi được email. Kiểm tra cấu hình dịch vụ email rồi dùng Gửi lại email xác minh.'});
}));
router.post('/verify-email',wrap(async(req,res)=>{
  const {token}=z.object({token:z.string().min(20).max(255)}).parse(req.body);
  await db.$transaction(async tx=>{
    const record=await tx.emailToken.findUnique({where:{tokenHash:sha(token)}});
    if(!record||record.purpose!=='VERIFY')fail(400,'Liên kết xác minh không hợp lệ hoặc đã hết hạn');
    const consumed=await tx.emailToken.deleteMany({where:{id:record.id,purpose:'VERIFY',expiresAt:{gt:new Date()}}});
    if(consumed.count!==1)fail(400,'Liên kết xác minh không hợp lệ hoặc đã hết hạn');
    await tx.user.update({where:{id:record.userId},data:{emailVerifiedAt:new Date()}});
    await tx.emailToken.deleteMany({where:{userId:record.userId,purpose:'VERIFY'}});
  });
  res.json({ok:true});
}));
router.post('/resend-verification',wrap(async(req,res)=>{
  const data=z.object({email}).parse(req.body);
  const user=await db.user.findUnique({where:{email:data.email}});
  if(user&&!user.locked&&!user.emailVerifiedAt)await deliverAccountToken(user,'VERIFY');
  res.json({message:genericVerify});
}));
router.post('/forgot-password',wrap(async(req,res)=>{
  const data=z.object({email}).parse(req.body);
  const user=await db.user.findUnique({where:{email:data.email}});
  if(user&&!user.locked&&user.passwordHash)await deliverAccountToken(user,'RESET');
  res.json({message:genericReset});
}));
router.post('/reset-password',wrap(async(req,res)=>{
  const d=z.object({token:z.string().min(20).max(255),password}).parse(req.body);
  const passwordHash=await bcrypt.hash(d.password,12);
  await db.$transaction(async tx=>{
    const record=await tx.emailToken.findUnique({where:{tokenHash:sha(d.token)}});
    if(!record||record.purpose!=='RESET')fail(400,'Liên kết đặt lại không hợp lệ hoặc đã hết hạn');
    const consumed=await tx.emailToken.deleteMany({where:{id:record.id,purpose:'RESET',expiresAt:{gt:new Date()}}});
    if(consumed.count!==1)fail(400,'Liên kết đặt lại không hợp lệ hoặc đã hết hạn');
    await tx.user.update({where:{id:record.userId},data:{passwordHash}});
    await tx.session.deleteMany({where:{userId:record.userId}});
    await tx.emailToken.deleteMany({where:{userId:record.userId,purpose:'RESET'}});
  });
  res.json({ok:true,message:'Mật khẩu mới đã được lưu. Vui lòng đăng nhập lại.'});
}));
router.post('/login',wrap(async(req,res)=>{
  const d=z.object({email,password:z.string().min(1).max(1000)}).parse(req.body);
  const user=await db.user.findUnique({where:{email:d.email}});
  if(!user||!user.passwordHash||user.locked||!(await bcrypt.compare(d.password,user.passwordHash)))fail(401,'Email hoặc mật khẩu không chính xác');
  if(!user.emailVerifiedAt)fail(403,'Tài khoản chưa xác minh email. Vui lòng kiểm tra email hoặc gửi lại liên kết xác minh.');
  await makeSession(user.id,res);
  res.set('Cache-Control','no-store').json({user:publicUser(user)});
}));
router.post('/logout',wrap(async(req,res)=>{await endSession(req,res);res.set('Cache-Control','no-store').json({ok:true})}));
router.get('/me',auth,(req,res)=>res.set('Cache-Control','no-store').json({user:publicUser(req.user)}));
export default router;
