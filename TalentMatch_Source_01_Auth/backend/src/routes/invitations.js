import {Router} from 'express';
import {z} from 'zod';
import {db} from '../lib/db.js';
import {wrap,fail} from '../lib/errors.js';
import {auth,roles} from '../middleware/auth.js';
import {notify} from '../lib/notify.js';
const router=Router();
router.get('/mine',auth,wrap(async(req,res)=>{
  const where=req.user.role==='FREELANCER'?{freelancerId:req.user.id}:{clientId:req.user.id};
  res.json({items:await db.invitation.findMany({where,include:{job:{select:{id:true,title:true,status:true,budget:true}},client:{select:{fullName:true}},freelancer:{select:{fullName:true}}},take:70,orderBy:{createdAt:'desc'}})});
}));
router.post('/',roles('CLIENT'),wrap(async(req,res)=>{
  const data=z.object({jobId:z.string().min(5),freelancerId:z.string().min(5),message:z.string().trim().min(15).max(2000)}).parse(req.body);
  const job=await db.jobPost.findUnique({where:{id:data.jobId}});
  if(!job||job.clientId!==req.user.id||job.status!=='PUBLISHED') fail(409,'Dự án không khả dụng để mời');
  const freelancer=await db.user.findFirst({where:{id:data.freelancerId,role:'FREELANCER',locked:false}});
  if(!freelancer) fail(404,'Freelancer không tồn tại');
  const invitation=await db.invitation.create({data:{...data,clientId:req.user.id}});
  await notify(freelancer.id,`Lời mời hợp tác: ${job.title}`);
  res.status(201).json({invitation});
}));
router.post('/:id/respond',roles('FREELANCER'),wrap(async(req,res)=>{
  const {action}=z.object({action:z.enum(['ACCEPTED','DECLINED'])}).parse(req.body);
  const result=await db.$transaction(async tx=>{
    const inv=await tx.invitation.findUnique({where:{id:req.params.id},include:{job:true}});
    if(!inv||inv.freelancerId!==req.user.id) fail(404,'Không tìm thấy lời mời');
    if(inv.status!=='PENDING'||inv.job.status!=='PUBLISHED') fail(409,'Lời mời không còn hiệu lực');
    if(action==='ACCEPTED'){const old=await tx.application.findUnique({where:{jobId_freelancerId:{jobId:inv.jobId,freelancerId:req.user.id}}});if(old&&!['SUBMITTED','REVIEWING','SHORTLISTED'].includes(old.status))fail(409,'Đơn ứng tuyển trước đây đã đóng, không thể nhận lời mời này');}
    const changed=await tx.invitation.updateMany({where:{id:inv.id,status:'PENDING'},data:{status:action}});
    if(!changed.count) fail(409,'Lời mời đã được xử lý');
    if(action==='ACCEPTED')await tx.application.upsert({where:{jobId_freelancerId:{jobId:inv.jobId,freelancerId:req.user.id}},create:{jobId:inv.jobId,freelancerId:req.user.id,coverLetter:inv.message,bid:inv.job.budget,days:30,status:'SUBMITTED'},update:{}});
    return inv;
  });
  await notify(result.clientId,`Freelancer đã ${action==='ACCEPTED'?'chấp nhận':'từ chối'} lời mời: ${result.job.title}`);
  res.json({ok:true,notice:action==='ACCEPTED'?'Đã tạo đơn ứng tuyển; Client có thể chọn bạn từ danh sách ứng viên.':'Đã từ chối lời mời.'});
}));
export default router;
