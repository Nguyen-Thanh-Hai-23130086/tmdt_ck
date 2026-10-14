import {Router} from 'express';
import {z} from 'zod';
import multer from 'multer';
import sharp from 'sharp';
import {fileTypeFromBuffer} from 'file-type';
import {randomUUID} from 'node:crypto';
import {mkdir,writeFile,unlink} from 'node:fs/promises';
import path from 'node:path';
import {db} from '../lib/db.js';
import {wrap,fail} from '../lib/errors.js';
import {auth,roles} from '../middleware/auth.js';
const router=Router();
const select={id:true,fullName:true,avatarUrl:true,location:true,bio:true,role:true,freelancer:{include:{portfolio:true}},company:true};
router.get('/me',auth,wrap(async(req,res)=>res.json({profile:await db.user.findUnique({where:{id:req.user.id},select})})));
const profileInput=z.object({fullName:z.string().min(2).max(90),location:z.string().max(120).optional().nullable(),bio:z.string().max(3000).optional().nullable(),headline:z.string().max(140).optional(),hourlyRate:z.number().int().min(0).max(100000000).optional(),experienceYears:z.number().int().min(0).max(80).optional(),skills:z.array(z.string().trim().min(1).max(60)).max(20).optional(),languages:z.array(z.string().max(40)).max(10).optional(),workMode:z.enum(['REMOTE','ONSITE','HYBRID']).optional(),companyName:z.string().max(120).optional(),industry:z.string().max(100).optional(),website:z.union([z.literal(''),z.string().url()]).optional(),companyDescription:z.string().max(3000).optional()});
router.patch('/me',auth,wrap(async(req,res)=>{
  const d=profileInput.parse(req.body);
  const user=await db.user.update({where:{id:req.user.id},data:{fullName:d.fullName,location:d.location,bio:d.bio,
    freelancer:req.user.role==='FREELANCER'?{upsert:{create:{headline:d.headline||'Freelancer',hourlyRate:d.hourlyRate??0,experienceYears:d.experienceYears??0,skills:d.skills||[],languages:d.languages||['Tiếng Việt'],workMode:d.workMode||'REMOTE'},update:{headline:d.headline,hourlyRate:d.hourlyRate,experienceYears:d.experienceYears,skills:d.skills,languages:d.languages,workMode:d.workMode}}}:undefined,
    company:req.user.role==='CLIENT' && d.companyName?{upsert:{create:{name:d.companyName,industry:d.industry,website:d.website||null,description:d.companyDescription},update:{name:d.companyName,industry:d.industry,website:d.website||null,description:d.companyDescription}}}:undefined},select});
  res.json({profile:user});
}));
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:5*1024*1024,files:1}}).single('image');
router.post('/avatar',auth,upload,wrap(async(req,res)=>{
  if(!req.file) fail(400,'Hãy chọn ảnh');
  const type=await fileTypeFromBuffer(req.file.buffer);
  if(!['image/jpeg','image/png','image/webp'].includes(type?.mime)) fail(400,'Chỉ hỗ trợ JPEG, PNG hoặc WebP');
  const name=`${randomUUID()}.webp`;
  const dir=path.resolve(process.env.UPLOAD_DIR||'uploads/public'); await mkdir(dir,{recursive:true});
  const safe=await sharp(req.file.buffer,{limitInputPixels:16000000}).rotate().resize({width:1000,height:1000,fit:'inside',withoutEnlargement:true}).webp({quality:82}).toBuffer();
  await writeFile(path.join(dir,name),safe);
  const previous=req.user.avatarUrl;
  const avatarUrl=`/uploads/${name}`;
  await db.user.update({where:{id:req.user.id},data:{avatarUrl}});
  if(previous?.startsWith('/uploads/')) await unlink(path.join(dir,path.basename(previous))).catch(()=>{});
  res.json({avatarUrl});
}));
router.delete('/avatar',auth,wrap(async(req,res)=>{
  const previous=req.user.avatarUrl;
  await db.user.update({where:{id:req.user.id},data:{avatarUrl:null}});
  if(previous?.startsWith('/uploads/')) await unlink(path.join(path.resolve(process.env.UPLOAD_DIR||'uploads/public'),path.basename(previous))).catch(()=>{});
  res.json({ok:true});
}));
router.get('/freelancers',wrap(async(req,res)=>{
  const q=String(req.query.q||'').slice(0,80);
  const skill=String(req.query.skill||'').slice(0,60);
  const page=Math.min(100,Math.max(1,Number(req.query.page)||1));
  const where={role:'FREELANCER',locked:false,AND:[q?{OR:[{fullName:{contains:q,mode:'insensitive'}},{freelancer:{is:{headline:{contains:q,mode:'insensitive'}}}}]}:{},skill?{freelancer:{is:{skills:{has:skill}}}}:{}]};
  const [items,total]=await Promise.all([db.user.findMany({where,select,orderBy:{createdAt:'desc'},take:12,skip:(page-1)*12}),db.user.count({where})]);
  res.json({items,total,page});
}));
router.get('/freelancers/:id',wrap(async(req,res)=>{
  const profile=await db.user.findFirst({where:{id:req.params.id,role:'FREELANCER',locked:false},select});
  if(!profile) fail(404,'Không tìm thấy freelancer');
  res.json({profile});
}));
router.post('/portfolio',roles('FREELANCER'),wrap(async(req,res)=>{
  const data=z.object({title:z.string().min(3).max(140),description:z.string().min(10).max(3000),imageUrl:z.string().max(255).optional()}).parse(req.body);
  if(data.imageUrl && !/^\/uploads\/[a-zA-Z0-9_.-]+$/.test(data.imageUrl)) fail(400,'Đường dẫn ảnh không hợp lệ');
  res.status(201).json({item:await db.portfolioItem.create({data:{freelancerId:req.user.id,...data}})});
}));
router.delete('/portfolio/:id',roles('FREELANCER'),wrap(async(req,res)=>{
  const result=await db.portfolioItem.deleteMany({where:{id:req.params.id,freelancerId:req.user.id}});
  if(!result.count) fail(404,'Không tìm thấy portfolio');
  res.json({ok:true});
}));

// Images supplied by users are converted to safe WebP by Sharp before publishing.
router.post('/portfolio/image',roles('FREELANCER'),upload,wrap(async(req,res)=>{
  if(!req.file) fail(400,'Hãy chọn ảnh portfolio');
  const type=await fileTypeFromBuffer(req.file.buffer);
  if(!['image/jpeg','image/png','image/webp'].includes(type?.mime)) fail(400,'Tệp ảnh không hợp lệ');
  const name=`portfolio-${req.user.id}-${randomUUID()}.webp`;
  const dir=path.resolve(process.env.UPLOAD_DIR||'uploads/public');
  await mkdir(dir,{recursive:true});
  const image=await sharp(req.file.buffer,{limitInputPixels:16000000}).rotate().resize({width:1400,height:1000,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toBuffer();
  await writeFile(path.join(dir,name),image);
  res.status(201).json({imageUrl:`/uploads/${name}`});
}));
router.post('/company/logo',roles('CLIENT'),upload,wrap(async(req,res)=>{
  if(!req.file) fail(400,'Hãy chọn logo doanh nghiệp');
  const type=await fileTypeFromBuffer(req.file.buffer);
  if(!['image/jpeg','image/png','image/webp'].includes(type?.mime)) fail(400,'Tệp logo không hợp lệ');
  const name=`company-${req.user.id}-${randomUUID()}.webp`;
  const dir=path.resolve(process.env.UPLOAD_DIR||'uploads/public');await mkdir(dir,{recursive:true});
  const image=await sharp(req.file.buffer,{limitInputPixels:16000000}).rotate().resize({width:700,height:700,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toBuffer();
  await writeFile(path.join(dir,name),image);
  const previous=(await db.company.findUnique({where:{userId:req.user.id}}))?.logoUrl;
  await db.company.upsert({where:{userId:req.user.id},create:{userId:req.user.id,name:req.user.fullName+' (chưa đặt tên)',logoUrl:`/uploads/${name}`},update:{logoUrl:`/uploads/${name}`}});
  if(previous?.startsWith('/uploads/')&&!previous.startsWith('/uploads/demo/')) await unlink(path.join(dir,path.basename(previous))).catch(()=>{});
  res.json({logoUrl:`/uploads/${name}`});
}));
router.delete('/company/logo',roles('CLIENT'),wrap(async(req,res)=>{
  const previous=(await db.company.findUnique({where:{userId:req.user.id}}))?.logoUrl;
  await db.company.updateMany({where:{userId:req.user.id},data:{logoUrl:null}});
  if(previous?.startsWith('/uploads/')&&!previous.startsWith('/uploads/demo/')) await unlink(path.join(path.resolve(process.env.UPLOAD_DIR||'uploads/public'),path.basename(previous))).catch(()=>{});
  res.json({ok:true});
}));
router.patch('/portfolio/:id',roles('FREELANCER'),wrap(async(req,res)=>{
  const d=z.object({title:z.string().min(3).max(140),description:z.string().min(10).max(3000),imageUrl:z.string().regex(/^\/uploads\/[a-zA-Z0-9_/.-]+$/).optional().nullable()}).parse(req.body);
  const result=await db.portfolioItem.updateMany({where:{id:req.params.id,freelancerId:req.user.id},data:d});
  if(!result.count) fail(404,'Portfolio không tồn tại');
  res.json({ok:true});
}));

export default router;
