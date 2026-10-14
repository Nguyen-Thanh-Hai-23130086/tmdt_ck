import {Router} from 'express';
import {z} from 'zod';
import {db} from '../lib/db.js';
import {roles} from '../middleware/auth.js';
import {wrap,fail} from '../lib/errors.js';
const router=Router();router.use(roles('ADMIN'));
router.get('/stats',wrap(async(req,res)=>{
  const [users,jobs,applications,workspaces]=await Promise.all([db.user.count(),db.jobPost.count(),db.application.count(),db.workspace.count()]);
  res.json({users,jobs,applications,workspaces});
}));
router.get('/users',wrap(async(req,res)=>res.json({items:await db.user.findMany({select:{id:true,fullName:true,email:true,role:true,locked:true,createdAt:true},orderBy:{createdAt:'desc'},take:100})})));
router.patch('/users/:id/lock',wrap(async(req,res)=>{
  const {locked}=z.object({locked:z.boolean()}).parse(req.body);
  if(req.params.id===req.user.id) fail(400,'Không thể tự khóa tài khoản');
  const target=await db.user.findUnique({where:{id:req.params.id}});
  if(!target) fail(404,'Không tìm thấy người dùng');
  if(target.role==='ADMIN') fail(403,'Không thể thay đổi tài khoản Admin');
  const user=await db.$transaction(async tx=>{
    const result=await tx.user.update({where:{id:target.id},data:{locked}});
    if(locked) await tx.session.deleteMany({where:{userId:target.id}});
    await tx.auditLog.create({data:{actorId:req.user.id,action:locked?'LOCK_USER':'UNLOCK_USER',targetId:target.id}});
    return result;
  });
  res.json({user:{id:user.id,locked:user.locked}});
}));
router.get('/jobs',wrap(async(req,res)=>res.json({items:await db.jobPost.findMany({include:{client:{select:{fullName:true,email:true}}},take:100,orderBy:{createdAt:'desc'}})})));
router.get('/audit',wrap(async(req,res)=>res.json({items:await db.auditLog.findMany({take:100,orderBy:{createdAt:'desc'}})})));
router.get('/complaints',wrap(async(req,res)=>res.json({items:await db.complaint.findMany({include:{reporter:{select:{fullName:true,email:true}},workspace:{include:{job:{select:{title:true}}}}},orderBy:{createdAt:'desc'},take:100})})));
router.patch('/complaints/:id',wrap(async(req,res)=>{
  const d=z.object({status:z.enum(['OPEN','REVIEWING','RESOLVED','DISMISSED']),response:z.string().max(3000)}).parse(req.body);
  const result=await db.$transaction(async tx=>{
    const complaint=await tx.complaint.update({where:{id:req.params.id},data:d});
    await tx.auditLog.create({data:{actorId:req.user.id,action:'COMPLAINT_'+d.status,targetId:complaint.id}});
    return complaint;
  });
  res.json({complaint:result});
}));
router.post('/jobs/:id/moderate',wrap(async(req,res)=>{
  const d=z.object({status:z.enum(['CANCELLED','PUBLISHED'])}).parse(req.body);
  const updated=await db.$transaction(async tx=>{
    const job=await tx.jobPost.findUnique({where:{id:req.params.id}});
    if(!job || !['PUBLISHED','CANCELLED'].includes(job.status))fail(409,'Không thể thay đổi dự án đang hợp tác');
    const result=await tx.jobPost.update({where:{id:job.id},data:{status:d.status}});
    await tx.auditLog.create({data:{actorId:req.user.id,action:'MODERATE_JOB_'+d.status,targetId:job.id}});
    return result;
  });
  res.json({job:updated});
}));
router.get('/transactions',wrap(async(req,res)=>res.json({items:await db.transaction.findMany({include:{workspace:{include:{job:{select:{title:true}},client:{select:{fullName:true}},freelancer:{select:{fullName:true}}}}},orderBy:{createdAt:'desc'},take:100})})));
router.get('/reviews',wrap(async(req,res)=>res.json({items:await db.review.findMany({include:{author:{select:{fullName:true}},target:{select:{fullName:true}},workspace:{include:{job:{select:{title:true}}}}},orderBy:{createdAt:'desc'},take:100})})));
router.patch('/reviews/:id/moderate',wrap(async(req,res)=>{
  const {hidden}=z.object({hidden:z.boolean()}).parse(req.body);
  const review=await db.$transaction(async tx=>{
    const r=await tx.review.update({where:{id:req.params.id},data:{hidden}});
    await tx.auditLog.create({data:{actorId:req.user.id,targetId:r.id,action:hidden?'HIDE_REVIEW':'SHOW_REVIEW'}});
    return r;
  });
  res.json({review});
}));
export default router;
