import {Router} from 'express';
import {db} from '../lib/db.js';
import {wrap} from '../lib/errors.js';
import {auth} from '../middleware/auth.js';
const router=Router();router.use(auth);
router.get('/',wrap(async(req,res)=>res.json({items:await db.notification.findMany({where:{userId:req.user.id},orderBy:{createdAt:'desc'},take:50})})));
router.post('/read',wrap(async(req,res)=>{await db.notification.updateMany({where:{userId:req.user.id,read:false},data:{read:true}});res.json({ok:true})}));
export default router;
