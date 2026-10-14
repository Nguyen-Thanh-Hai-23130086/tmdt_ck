import {Router} from 'express';
import {z} from 'zod';
import {db} from '../lib/db.js';
import {wrap,fail} from '../lib/errors.js';
import {auth} from '../middleware/auth.js';
const router=Router();
router.use(auth);
router.get('/mine',wrap(async(req,res)=>res.json({items:await db.complaint.findMany({where:{reporterId:req.user.id},include:{workspace:{include:{job:{select:{title:true}}}}},take:50,orderBy:{createdAt:'desc'}})})));
router.post('/',wrap(async(req,res)=>{
  const d=z.object({workspaceId:z.string().min(5),detail:z.string().trim().min(20).max(5000)}).parse(req.body);
  const w=await db.workspace.findUnique({where:{id:d.workspaceId}});
  if(!w||(w.clientId!==req.user.id&&w.freelancerId!==req.user.id))fail(403,'Bạn không phải thành viên workspace');
  const complaint=await db.complaint.create({data:{...d,reporterId:req.user.id}});
  res.status(201).json({complaint});
}));
export default router;
