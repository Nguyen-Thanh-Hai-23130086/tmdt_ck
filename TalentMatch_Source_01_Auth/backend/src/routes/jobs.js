import {Router} from 'express';
import {z} from 'zod';
import {db} from '../lib/db.js';
import {fail,wrap} from '../lib/errors.js';
import {roles} from '../middleware/auth.js';
import {canApply} from '../services/transitions.js';
import {scoreFreelancer} from '../services/matching.js';
import {notify} from '../lib/notify.js';
const router=Router();
const jobInput=z.object({title:z.string().trim().min(8).max(160),description:z.string().trim().min(30).max(10000),budget:z.number().int().min(100000).max(2000000000),skills:z.array(z.string().trim().min(1).max(50)).max(15),deadline:z.string().datetime().optional().nullable()});
const include={client:{select:{id:true,fullName:true,avatarUrl:true,company:true}},_count:{select:{applications:true}}};
router.get('/',wrap(async(req,res)=>{
  const q=String(req.query.q||'').slice(0,80);const skill=String(req.query.skill||'').slice(0,60);
  const page=Math.min(100,Math.max(1,Number(req.query.page)||1));
  const where={status:'PUBLISHED',AND:[q?{OR:[{title:{contains:q,mode:'insensitive'}},{description:{contains:q,mode:'insensitive'}}]}:{},skill?{skills:{has:skill}}:{}]};
  const [items,total]=await Promise.all([db.jobPost.findMany({where,include,orderBy:{createdAt:'desc'},skip:(page-1)*12,take:12}),db.jobPost.count({where})]);
  res.json({items,total,page});
}));
router.get('/mine',roles('CLIENT'),wrap(async(req,res)=>res.json({items:await db.jobPost.findMany({where:{clientId:req.user.id},include,orderBy:{createdAt:'desc'}})})));
router.get('/applications/mine',roles('FREELANCER'),wrap(async(req,res)=>res.json({items:await db.application.findMany({where:{freelancerId:req.user.id},include:{job:{select:{id:true,title:true,budget:true,status:true}}},orderBy:{createdAt:'desc'}})})));
router.post('/',roles('CLIENT'),wrap(async(req,res)=>{
  const d=jobInput.parse(req.body);
  if(d.deadline && new Date(d.deadline)<new Date()) fail(400,'Hạn phải ở tương lai');
  res.status(201).json({job:await db.jobPost.create({data:{clientId:req.user.id,title:d.title,description:d.description,budget:d.budget,skills:d.skills,deadline:d.deadline?new Date(d.deadline):null}})});
}));
router.get('/:id',wrap(async(req,res)=>{
  const job=await db.jobPost.findUnique({where:{id:req.params.id},include});
  if(!job) fail(404,'Dự án không tồn tại');
  if(job.status==='DRAFT' && req.user?.id!==job.clientId && req.user?.role!=='ADMIN') fail(404,'Dự án không tồn tại');
  res.json({job});
}));
router.patch('/:id',roles('CLIENT'),wrap(async(req,res)=>{
  const job=await db.jobPost.findUnique({where:{id:req.params.id}});
  if(!job || job.clientId!==req.user.id) fail(404,'Không tìm thấy dự án');
  if(!['PUBLISHED','DRAFT'].includes(job.status)) fail(409,'Không thể sửa dự án đã nhận người');
  const d=jobInput.parse(req.body);
  res.json({job:await db.jobPost.update({where:{id:job.id},data:{...d,deadline:d.deadline?new Date(d.deadline):null}})});
}));
router.post('/:id/apply',roles('FREELANCER'),wrap(async(req,res)=>{
  const d=z.object({coverLetter:z.string().min(20).max(5000),bid:z.number().int().min(100000),days:z.number().int().min(1).max(730)}).parse(req.body);
  const job=await db.jobPost.findUnique({where:{id:req.params.id}});
  if(!job) fail(404,'Dự án không tồn tại');
  if(!canApply(job,req.user.id)) fail(409,'Không thể ứng tuyển dự án này');
  const application=await db.application.create({data:{...d,jobId:job.id,freelancerId:req.user.id}});
  await notify(job.clientId,`Có ứng tuyển mới cho dự án ${job.title}`);
  res.status(201).json({application});
}));
router.get('/:id/applications',roles('CLIENT'),wrap(async(req,res)=>{
  const job=await db.jobPost.findUnique({where:{id:req.params.id}});
  if(!job || job.clientId!==req.user.id) fail(404,'Dự án không tồn tại');
  res.json({items:await db.application.findMany({where:{jobId:job.id},include:{freelancer:{select:{id:true,fullName:true,avatarUrl:true,freelancer:true}}},orderBy:{createdAt:'desc'}})});
}));
router.post('/:id/accept/:applicationId',roles('CLIENT'),wrap(async(req,res)=>{
  const job=await db.jobPost.findUnique({where:{id:req.params.id}});
  if(!job || job.clientId!==req.user.id) fail(404,'Dự án không tồn tại');
  if(job.status!=='PUBLISHED') fail(409,'Dự án đã thay đổi trạng thái');
  const application=await db.application.findUnique({where:{id:req.params.applicationId}});
  if(!application || application.jobId!==job.id || !['SUBMITTED','REVIEWING','SHORTLISTED'].includes(application.status)) fail(409,'Ứng tuyển không hợp lệ');
  const workspace=await db.$transaction(async(tx)=>{
    // optimistic update prevents accepting multiple freelancers concurrently
    const updated=await tx.jobPost.updateMany({where:{id:job.id,status:'PUBLISHED'},data:{status:'IN_PROGRESS'}});
    if(!updated.count) fail(409,'Dự án đã nhận freelancer');
    await tx.application.update({where:{id:application.id},data:{status:'ACCEPTED'}});
    await tx.application.updateMany({where:{jobId:job.id,id:{not:application.id},status:{not:'WITHDRAWN'}},data:{status:'REJECTED'}});
    const w=await tx.workspace.create({data:{jobId:job.id,clientId:req.user.id,freelancerId:application.freelancerId,agreedBudget:application.bid}});
    await tx.transaction.create({data:{workspaceId:w.id,amount:application.bid,reference:`DEMO-${w.id}`}});
    return w;
  });
  await notify(application.freelancerId,`Bạn đã được chọn cho dự án ${job.title}`);
  res.status(201).json({workspace});
}));
router.post('/:id/close',roles('CLIENT'),wrap(async(req,res)=>{
  const updated=await db.jobPost.updateMany({where:{id:req.params.id,clientId:req.user.id,status:'PUBLISHED'},data:{status:'CANCELLED'}});
  if(!updated.count)fail(409,'Không thể đóng dự án ở trạng thái hiện tại');
  res.json({ok:true});
}));
router.post('/:id/applications/:aid/reject',roles('CLIENT'),wrap(async(req,res)=>{
  const job=await db.jobPost.findFirst({where:{id:req.params.id,clientId:req.user.id,status:'PUBLISHED'}});
  if(!job)fail(409,'Dự án không thể xét ứng viên');
  const result=await db.application.updateMany({where:{id:req.params.aid,jobId:job.id,status:{in:['SUBMITTED','REVIEWING','SHORTLISTED']}},data:{status:'REJECTED'}});
  if(!result.count)fail(409,'Không thể từ chối đơn này');
  res.json({ok:true});
}));
router.post('/:id/applications/withdraw',roles('FREELANCER'),wrap(async(req,res)=>{
  const result=await db.application.updateMany({where:{jobId:req.params.id,freelancerId:req.user.id,status:{in:['SUBMITTED','REVIEWING','SHORTLISTED']}},data:{status:'WITHDRAWN'}});
  if(!result.count)fail(409,'Không thể rút đơn này');
  res.json({ok:true});
}));
// Explainable rule-based ranking; this is not an AI model.
router.get('/:id/matches',roles('CLIENT'),wrap(async(req,res)=>{
  const job=await db.jobPost.findFirst({where:{id:req.params.id,clientId:req.user.id}});
  if(!job)fail(404,'Không tìm thấy dự án');
  const candidates=await db.user.findMany({where:{role:'FREELANCER',locked:false,freelancer:{isNot:null}},select:{id:true,fullName:true,avatarUrl:true,location:true,freelancer:true},take:300});
  const matches=candidates.map(u=>{
    const scored=scoreFreelancer(job,u.freelancer);
    return {id:u.id,fullName:u.fullName,avatarUrl:u.avatarUrl,headline:u.freelancer.headline,...scored};
  }).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id)).slice(0,12);
  res.json({kind:'RULE_BASED',items:matches});
}));
export default router;
