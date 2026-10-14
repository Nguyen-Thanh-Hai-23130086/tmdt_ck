import {Router} from 'express';
import {z} from 'zod';
import {db} from '../lib/db.js';
import {wrap,fail} from '../lib/errors.js';
import {auth,roles} from '../middleware/auth.js';
import {canTransitionMilestone,canReview} from '../services/transitions.js';
import {notify} from '../lib/notify.js';
const router=Router();
const detail={job:{select:{id:true,title:true,status:true,budget:true}},client:{select:{id:true,fullName:true,avatarUrl:true}},freelancer:{select:{id:true,fullName:true,avatarUrl:true}},milestones:{orderBy:{createdAt:'asc'}},messages:{orderBy:{createdAt:'asc'},take:100,include:{sender:{select:{id:true,fullName:true,avatarUrl:true}}}},transactions:true,reviews:true};
const accessible=(w,u)=>w&&(w.clientId===u.id || w.freelancerId===u.id || u.role==='ADMIN');
async function load(id,u){const w=await db.workspace.findUnique({where:{id},include:detail});if(!accessible(w,u)) fail(404,'Không tìm thấy workspace');return w;}
router.get('/mine',auth,wrap(async(req,res)=>{
  const where=req.user.role==='ADMIN'?{}:{OR:[{clientId:req.user.id},{freelancerId:req.user.id}]};
  res.json({items:await db.workspace.findMany({where,include:{job:true,client:{select:{id:true,fullName:true}},freelancer:{select:{id:true,fullName:true}}},orderBy:{createdAt:'desc'},take:50})});
}));
router.get('/:id',auth,wrap(async(req,res)=>res.json({workspace:await load(req.params.id,req.user)})));
router.post('/:id/milestones',roles('CLIENT'),wrap(async(req,res)=>{
  const w=await load(req.params.id,req.user);
  if(w.clientId!==req.user.id || w.job.status!=='IN_PROGRESS') fail(409,'Không thể tạo milestone');
  const d=z.object({title:z.string().min(4).max(140),description:z.string().max(2000).optional(),amount:z.number().int().min(0),dueAt:z.string().datetime().optional().nullable()}).parse(req.body);
  const sum=w.milestones.reduce((s,m)=>s+m.amount,0);
  if(sum+d.amount>w.agreedBudget) fail(400,'Tổng milestone vượt ngân sách đã thống nhất');
  const milestone=await db.milestone.create({data:{workspaceId:w.id,title:d.title,description:d.description,amount:d.amount,dueAt:d.dueAt?new Date(d.dueAt):null}});
  await notify(w.freelancerId,`Có milestone mới: ${d.title}`);
  res.status(201).json({milestone});
}));
router.post('/:id/milestones/:mid/submit',roles('FREELANCER'),wrap(async(req,res)=>{
  const w=await load(req.params.id,req.user);
  if(w.freelancerId!==req.user.id || !['IN_PROGRESS','REVISION'].includes(w.job.status)) fail(403,'Không có quyền bàn giao');
  const {deliverable}=z.object({deliverable:z.string().min(10).max(10000)}).parse(req.body);
  const m=w.milestones.find(m=>m.id===req.params.mid);
  if(!m || !canTransitionMilestone(m.status,'SUBMITTED','FREELANCER')) fail(409,'Không thể bàn giao milestone này');
  const milestone=await db.milestone.update({where:{id:m.id},data:{status:'SUBMITTED',deliverable,revisionNote:null}});
  await notify(w.clientId,`Bàn giao mới: ${m.title}`);
  res.json({milestone});
}));
router.post('/:id/milestones/:mid/review',roles('CLIENT'),wrap(async(req,res)=>{
  const w=await load(req.params.id,req.user);
  if(w.clientId!==req.user.id) fail(403,'Không có quyền nghiệm thu');
  const d=z.object({action:z.enum(['APPROVED','REVISION']),revisionNote:z.string().max(3000).optional()}).parse(req.body);
  const m=w.milestones.find(m=>m.id===req.params.mid);
  if(!m || !canTransitionMilestone(m.status,d.action,'CLIENT')) fail(409,'Trạng thái không hợp lệ');
  if(d.action==='REVISION' && !d.revisionNote?.trim()) fail(400,'Vui lòng ghi yêu cầu chỉnh sửa');
  const milestone=await db.milestone.update({where:{id:m.id},data:{status:d.action,revisionNote:d.action==='REVISION'?d.revisionNote:null}});
  await notify(w.freelancerId,d.action==='APPROVED'?`Milestone đã nghiệm thu: ${m.title}`:`Cần chỉnh sửa milestone: ${m.title}`);
  res.json({milestone});
}));
router.post('/:id/complete',roles('CLIENT'),wrap(async(req,res)=>{
  const w=await load(req.params.id,req.user);
  if(w.clientId!==req.user.id || w.job.status!=='IN_PROGRESS') fail(409,'Không thể hoàn tất dự án');
  if(w.milestones.length===0 || w.milestones.some(m=>m.status!=='APPROVED')) fail(409,'Cần nghiệm thu tất cả milestone');
  await db.jobPost.update({where:{id:w.jobId},data:{status:'COMPLETED'}});
  await notify(w.freelancerId,`Dự án ${w.job.title} đã hoàn tất`);
  res.json({ok:true});
}));
router.post('/:id/payment-demo',roles('CLIENT'),wrap(async(req,res)=>{
  const w=await load(req.params.id,req.user);
  if(w.clientId!==req.user.id || w.job.status!=='COMPLETED') fail(409,'Chỉ mô phỏng thanh toán sau khi dự án hoàn tất');
  await db.transaction.updateMany({where:{workspaceId:w.id,status:'PENDING'},data:{status:'PAID_DEMO'}});
  await notify(w.freelancerId,`Giao dịch mô phỏng cho dự án ${w.job.title} đã được ghi nhận`);
  res.json({ok:true,notice:'Thanh toán mô phỏng, không chuyển tiền thật'});
}));
router.get('/:id/messages',auth,wrap(async(req,res)=>{
  const w=await load(req.params.id,req.user);res.json({items:w.messages});
}));
router.post('/:id/messages',auth,wrap(async(req,res)=>{
  const w=await load(req.params.id,req.user);
  if(req.user.role==='ADMIN') fail(403,'Admin không tham gia cuộc hội thoại');
  const {body}=z.object({body:z.string().trim().min(1).max(5000)}).parse(req.body);
  const message=await db.message.create({data:{workspaceId:w.id,senderId:req.user.id,body}});
  await notify(req.user.id===w.clientId?w.freelancerId:w.clientId,`Tin nhắn mới trong ${w.job.title}`);
  res.status(201).json({message});
}));
router.post('/:id/reviews',auth,wrap(async(req,res)=>{
  const w=await load(req.params.id,req.user);
  if(req.user.role==='ADMIN' || !canReview(w.job.status,req.user.id,req.user.id===w.clientId?w.freelancerId:w.clientId)) fail(409,'Không thể đánh giá');
  const d=z.object({rating:z.number().int().min(1).max(5),comment:z.string().min(10).max(2000)}).parse(req.body);
  const review=await db.review.create({data:{workspaceId:w.id,authorId:req.user.id,targetId:req.user.id===w.clientId?w.freelancerId:w.clientId,...d}});
  res.status(201).json({review});
}));
export default router;
