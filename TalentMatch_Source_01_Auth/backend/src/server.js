import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {db} from './lib/db.js';
import {identify} from './middleware/auth.js';
import {errorHandler} from './lib/errors.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import jobRoutes from './routes/jobs.js';
import workRoutes from './routes/workspaces.js';
import adminRoutes from './routes/admin.js';
import notificationRoutes from './routes/notifications.js';
import oauthRoutes from './routes/oauth.js';
import invitationRoutes from './routes/invitations.js';
import complaintRoutes from './routes/complaints.js';
const app=express();
app.disable('x-powered-by');
app.use(helmet({crossOriginResourcePolicy:{policy:'cross-origin'}}));
const frontend=process.env.FRONTEND_URL||'http://localhost:5173';
app.use(cors({origin:frontend,credentials:true}));
app.use(express.json({limit:'200kb'}));
app.use(cookieParser());
// Browser requests that mutate state must originate from the configured frontend.
app.use((req,res,next)=>{
  if(['POST','PUT','PATCH','DELETE'].includes(req.method)){
    const origin=req.headers.origin;
    if(origin && origin!==frontend) return res.status(403).json({error:'Nguồn yêu cầu không hợp lệ'});
  }
  next();
});
app.use(identify);
const authLimit=rateLimit({windowMs:15*60*1000,limit:25,standardHeaders:'draft-7',legacyHeaders:false});
app.get('/api/health',async(req,res)=>{
  try{await db.$queryRaw`SELECT 1`;res.json({status:'ok',database:'connected'});}catch{res.status(503).json({status:'unavailable',database:'disconnected'});}
});
app.use('/api/auth',(req,res,next)=> (req.method==='POST' && ['/login','/register','/forgot-password','/resend-verification','/reset-password'].includes(req.path)) ? authLimit(req,res,next) : next(),authRoutes);
app.use('/api/oauth',authLimit,oauthRoutes);
app.use('/api/profile',profileRoutes);
app.use('/api/jobs',jobRoutes);
app.use('/api/workspaces',workRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/notifications',notificationRoutes);
app.use('/api/invitations',invitationRoutes);
app.use('/api/complaints',complaintRoutes);
app.use('/uploads',express.static(path.resolve(process.env.UPLOAD_DIR||'uploads/public'),{maxAge:'7d',immutable:true}));
app.use((req,res)=>res.status(404).json({error:'Đường dẫn không tồn tại'}));
app.use(errorHandler);
const port=Number(process.env.PORT||4000);
app.listen(port,()=>console.log(`TalentMatch API listening on http://localhost:${port}`));
process.on('SIGTERM',async()=>{await db.$disconnect();process.exit(0)});
