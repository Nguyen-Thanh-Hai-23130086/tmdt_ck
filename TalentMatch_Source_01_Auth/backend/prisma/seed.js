import 'dotenv/config';
import bcrypt from 'bcryptjs';
import {PrismaClient} from '@prisma/client';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';

const db=new PrismaClient();
const names=['Nguyễn Minh Anh','Trần Gia Huy','Lê Hoài An','Phạm Thảo Vy','Hoàng Đức Minh','Đỗ Ngọc Linh','Võ Quốc Bảo','Bùi Khánh Chi','Đặng Thành Đạt','Huỳnh Bảo Ngọc','Phan Thanh Tùng','Vũ Hải Yến','Ngô Gia Phúc','Đinh Phương Mai','Tạ Minh Quân','Cao Nhật Hạ','Lý Quang Huy','Mai Thanh Trúc','Hồ Gia Hân','Dương Nhật Nam','Trịnh Bảo Trâm','Đoàn Phúc Khang','Kiều Mỹ Linh','Nguyễn Tuấn Kiệt','Lâm Hoài Phương'];
const cities=['TP. Hồ Chí Minh','Hà Nội','Đà Nẵng','Cần Thơ','Hải Phòng','Huế','Nha Trang','Biên Hòa'];
const areas=[
  {role:'Frontend Developer',skills:['React','TypeScript','Tailwind CSS','JavaScript']},
  {role:'Backend Developer',skills:['Node.js','PostgreSQL','REST API','Prisma']},
  {role:'UI/UX Designer',skills:['Figma','UI/UX','Design System','Prototyping']},
  {role:'Mobile Developer',skills:['Flutter','React Native','Firebase','Dart']},
  {role:'Graphic Designer',skills:['Illustrator','Photoshop','Branding','Logo']},
  {role:'Content Writer',skills:['Content Writing','SEO','Copywriting','Blog']},
  {role:'Digital Marketer',skills:['Google Ads','Meta Ads','Analytics','Marketing']},
  {role:'Data Analyst',skills:['Python','Power BI','SQL','Excel']},
  {role:'Fullstack Developer',skills:['React','Node.js','PostgreSQL','Docker']},
  {role:'Video Editor',skills:['Premiere Pro','After Effects','Video','Motion']}
];
const subjects=['Xây dựng website giới thiệu sản phẩm','Thiết kế hệ thống quản lý nội dung','Ứng dụng đặt lịch khám','Website thương mại điện tử','Hệ thống báo cáo doanh thu','Thiết kế bộ nhận diện thương hiệu','Chiến dịch nội dung mạng xã hội','Tối ưu SEO website doanh nghiệp','Ứng dụng quản lý kho','Dashboard phân tích khách hàng','Thiết kế landing page sự kiện','Nền tảng học trực tuyến','Website portfolio chuyên nghiệp','Thiết kế trải nghiệm app đặt món','Hệ thống quản lý nhân sự'];
const hues=['#2455e8','#9d5d3f','#2c776a','#974f87','#af7b2b','#3d6795','#7e5a9a','#547147','#bb5943','#355f75'];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const assetFolder=path.resolve(process.env.UPLOAD_DIR||'uploads/public','demo');
async function portrait(i,name){
  const fill=hues[i%hues.length],shirt=hues[(i+4)%hues.length];
  const skin=['#f3cba7','#d9a47f','#b9825e','#e3b58e'][i%4];
  const initials=name.split(' ').slice(-2).map(x=>x[0]).join('');
  const hair=i%3===0?'#24242e':i%3===1?'#4b342c':'#302c35';
  const glasses=i%5===0?'<g fill="none" stroke="#272a32" stroke-width="3"><rect x="55" y="78" width="31" height="21" rx="8"/><rect x="91" y="78" width="31" height="21" rx="8"/><path d="M86 87h5"/></g>':'';
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" role="img"><rect width="180" height="180" fill="${fill}"/><circle cx="143" cy="36" r="56" fill="#fff" opacity=".09"/><path d="M0 172 Q90 100 180 172V180H0" fill="${shirt}"/><path d="M45 172 Q40 133 74 125h32q35 8 29 47" fill="${shirt}"/><rect x="80" y="110" width="23" height="29" rx="9" fill="${skin}"/><ellipse cx="91" cy="80" rx="42" ry="49" fill="${skin}"/><path d="M49 78q-5-57 45-58 49-3 41 59l-8-20q-20-3-39-19Q73 61 54 63Z" fill="${hair}"/><circle cx="76" cy="86" r="2.8" fill="#20232b"/><circle cx="107" cy="86" r="2.8" fill="#20232b"/><path d="M82 103q10 9 19 0" stroke="#894f42" fill="none" stroke-width="2.4" stroke-linecap="round"/>${glasses}<text x="156" y="164" font-size="9" fill="#fff" opacity=".55" text-anchor="end">${esc(initials)}</text></svg>`;
  const filename=`avatar-${String(i).padStart(3,'0')}.svg`;
  await writeFile(path.join(assetFolder,filename),svg);
  return `/uploads/demo/${filename}`;
}
async function cover(i,title){
  const color=hues[i%hues.length],label=esc(title.slice(0,36));
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 450"><rect width="700" height="450" fill="#f5f3ee"/><rect x="42" y="35" width="616" height="380" rx="24" fill="${color}"/><circle cx="560" cy="120" r="134" fill="#fff" opacity=".14"/><rect x="84" y="85" width="360" height="206" rx="12" fill="#fff" opacity=".9"/><rect x="110" y="111" width="180" height="15" rx="7" fill="${color}" opacity=".5"/><rect x="110" y="147" width="290" height="15" rx="7" fill="${color}" opacity=".2"/><rect x="110" y="181" width="240" height="15" rx="7" fill="${color}" opacity=".2"/><rect x="110" y="220" width="100" height="39" rx="12" fill="${color}"/><text x="85" y="366" font-family="Arial,sans-serif" font-size="27" font-weight="bold" fill="white">${label}</text></svg>`;
  const filename=`portfolio-${String(i).padStart(3,'0')}.svg`;await writeFile(path.join(assetFolder,filename),svg);return `/uploads/demo/${filename}`;
}
async function companyLogo(i){
  const color=hues[(i+3)%hues.length],filename=`company-${String(i).padStart(3,'0')}.svg`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect width="180" height="180" rx="32" fill="${color}"/><path d="M30 131L84 40l28 48 22-33 20 76Z" fill="white" opacity=".92"/><circle cx="138" cy="44" r="13" fill="#fff" opacity=".7"/></svg>`;
  await writeFile(path.join(assetFolder,filename),svg);return `/uploads/demo/${filename}`;
}
async function main(){
  if(process.env.NODE_ENV==='production') throw Error('Demo seed is disabled in production');
  await mkdir(assetFolder,{recursive:true});
  const passwordByRole={ADMIN:'AdminDemo!2026',CLIENT:'ClientDemo!2026',FREELANCER:'FreelancerDemo!2026'};
  const hashes={};for(const [role,pass] of Object.entries(passwordByRole)) hashes[role]=await bcrypt.hash(pass,12);
  const accounts=[];
  accounts.push({email:'admin@talentmatch.local',role:'ADMIN',name:'Quản trị TalentMatch'});
  accounts.push({email:'admin2@talentmatch.local',role:'ADMIN',name:'Quản trị hệ thống'});
  for(let i=0;i<23;i++) accounts.push({email:i===0?'client@talentmatch.local':`client${String(i+1).padStart(2,'0')}@talentmatch.local`,role:'CLIENT',name:names[(i+0)%names.length]});
  for(let i=0;i<75;i++) accounts.push({email:i===0?'freelancer@talentmatch.local':i===1?'designer@talentmatch.local':`freelancer${String(i+1).padStart(2,'0')}@talentmatch.local`,role:'FREELANCER',name:names[(i+1)%names.length]});
  if(accounts.length!==100)throw Error('Incorrect seed account count');
  const users=[];
  for(let i=0;i<accounts.length;i++){
    const a=accounts[i],skill=areas[(i+2)%areas.length],avatarUrl=await portrait(i,a.name),logoUrl=a.role==='CLIENT'?await companyLogo(i):null;
    const previous=await db.user.findUnique({where:{email:a.email}});
    if(previous&&!previous.isDemo)throw new Error(`Refusing to use real account as demo: ${a.email}`);
    const user=await db.user.upsert({where:{email:a.email},update:{},create:{email:a.email,passwordHash:hashes[a.role],fullName:a.name,role:a.role,emailVerifiedAt:new Date('2026-01-01T00:00:00Z'),isDemo:true,avatarUrl,location:cities[i%cities.length],bio:a.role==='FREELANCER'?`Chuyên ${skill.role.toLowerCase()} với kinh nghiệm làm việc cùng các nhóm sản phẩm tại Việt Nam. Luôn ưu tiên giải pháp rõ ràng và đúng tiến độ.`:`Tài khoản ${a.role==='ADMIN'?'quản trị':'khách hàng'} dùng thử trong TalentMatch.`,freelancer:a.role==='FREELANCER'?{create:{headline:skill.role,hourlyRate:180000+((i*53)%11)*65000,experienceYears:1+i%11,skills:skill.skills,languages:['Tiếng Việt',...(i%4===0?['English']:[])],workMode:['REMOTE','ONSITE','HYBRID'][i%3]}}:undefined,company:a.role==='CLIENT'?{create:{name:`${['An Phát','Sao Việt','Ngôi Sao','Cầu Vồng','Thanh Xuân'][i%5]} Studio ${String(i).padStart(2,'0')} (demo)`,industry:areas[i%areas.length].role,description:'Doanh nghiệp mô phỏng phục vụ đồ án TalentMatch. Chưa xác minh danh tính.',logoUrl}}:undefined}});
    if(user.isDemo&&!user.avatarUrl)await db.user.update({where:{id:user.id},data:{avatarUrl}});
    if(user.role==='CLIENT'){const c=await db.company.findUnique({where:{userId:user.id}});if(c&&!c.logoUrl)await db.company.update({where:{userId:user.id},data:{logoUrl}})}
    users.push(user);
  }
  const clients=users.filter(u=>u.role==='CLIENT'),freelancers=users.filter(u=>u.role==='FREELANCER');
  for(let i=0;i<freelancers.length;i++){
    const u=freelancers[i],area=areas[i%areas.length];
    const title=`${area.role} — ${subjects[i%subjects.length]} (demo)`;
    const found=await db.portfolioItem.findFirst({where:{freelancerId:u.id,title}});
    const imageUrl=await cover(i,title);
    if(!found)await db.portfolioItem.create({data:{freelancerId:u.id,title,description:`Dự án minh họa ${subjects[i%subjects.length].toLowerCase()}. Vai trò: ${area.role}; công nghệ: ${area.skills.join(', ')}. Dữ liệu demo.`,imageUrl}});
  }
  const jobs=[];
  for(let i=0;i<36;i++){
    const client=clients[i%clients.length],area=areas[i%areas.length];
    const title=`${subjects[i%subjects.length]} — ${area.role} #${String(i+1).padStart(2,'0')}`;
    const found=await db.jobPost.findFirst({where:{clientId:client.id,isDemo:true,title}});
    const finished=i<6,active=i>=6&&i<15;
    const job=found||await db.jobPost.create({data:{clientId:client.id,isDemo:true,title,description:`[Dữ liệu demo] Cần chuyên gia ${area.role} thực hiện ${subjects[i%subjects.length].toLowerCase()}. Yêu cầu giao tiếp rõ ràng, bàn giao mã nguồn hoặc tài liệu, có kiểm tra chất lượng và hỗ trợ điều chỉnh sau khi phản hồi.`,budget:5000000+(i%12)*2500000,skills:area.skills,status:finished?'COMPLETED':active?'IN_PROGRESS':'PUBLISHED',deadline:new Date(Date.now()+((i%12)+15)*86400000)}});
    jobs.push(job);
    for(let j=0;j<3;j++){
      const freelancer=freelancers[(i*3+j)%freelancers.length];
      const status=finished||active?(j===0?'ACCEPTED':'REJECTED'):'SUBMITTED';
      await db.application.upsert({where:{jobId_freelancerId:{jobId:job.id,freelancerId:freelancer.id}},update:{},create:{jobId:job.id,freelancerId:freelancer.id,coverLetter:`Xin chào, tôi có kinh nghiệm phù hợp với ${area.skills[0]} và sẵn sàng trao đổi yêu cầu chi tiết để hoàn thành dự án đúng tiến độ.`,bid:Math.round(job.budget*(0.8+j*.04)),days:12+(i+j)%30,status}});
    }
    if(!finished&&!active)continue;
    const freelancer=freelancers[(i*3)%freelancers.length];
    let work=await db.workspace.findUnique({where:{jobId:job.id}});
    if(!work){
      const bid=Math.round(job.budget*0.8);
      work=await db.workspace.create({data:{jobId:job.id,clientId:client.id,freelancerId:freelancer.id,agreedBudget:bid,
        milestones:{create:[{title:'Khảo sát và thiết kế',amount:Math.round(bid*.4),status:finished?'APPROVED':'SUBMITTED',deliverable:finished?'Tài liệu thiết kế đã bàn giao đầy đủ và được nghiệm thu.':'Bản thiết kế đầu tiên đã được gửi.'},{title:'Phát triển và bàn giao',amount:bid-Math.round(bid*.4),status:finished?'APPROVED':'OPEN',deliverable:finished?'Mã nguồn và hướng dẫn sử dụng đã bàn giao.':null}]},
        transactions:{create:{amount:bid,reference:`DEMO-${job.id}`,status:finished?'PAID_DEMO':'PENDING'}},
        messages:{create:[{senderId:client.id,body:'Chào bạn, mình gửi yêu cầu công việc qua workspace này.'},{senderId:freelancer.id,body:'Mình đã nhận được yêu cầu, sẽ cập nhật tiến độ thường xuyên.'}]}}});
    }
    if(finished){
      for(const [author,target] of [[client,freelancer],[freelancer,client]]){
        await db.review.upsert({where:{workspaceId_authorId:{workspaceId:work.id,authorId:author.id}},update:{},create:{workspaceId:work.id,authorId:author.id,targetId:target.id,rating:4+(i%2),comment:'Làm việc chuyên nghiệp, trao đổi rõ ràng và hoàn thành đúng cam kết. Đánh giá mô phỏng.'}});
      }
    }
    const existing=await db.notification.findFirst({where:{userId:freelancer.id,text:`Bạn đã được chọn cho dự án ${job.title}`}});
    if(!existing)await db.notification.create({data:{userId:freelancer.id,text:`Bạn đã được chọn cho dự án ${job.title}`}});
  }
  // Idempotent invitations for published jobs and sample dispute reports.
  for(let i=15;i<24;i++){
    const job=jobs[i],client=clients[i%clients.length],freelancer=freelancers[(i*3+5)%freelancers.length];
    await db.invitation.upsert({where:{jobId_freelancerId:{jobId:job.id,freelancerId:freelancer.id}},update:{},create:{jobId:job.id,clientId:client.id,freelancerId:freelancer.id,message:`Chào bạn, chúng tôi muốn mời bạn trao đổi dự án ${job.title}. Đây là lời mời demo.`}});
  }
  const finishedWorkspaces=await db.workspace.findMany({where:{jobId:{in:jobs.slice(0,3).map(j=>j.id)}}});
  for(const w of finishedWorkspaces){
    const msg='Yêu cầu hỗ trợ mô phỏng: xác nhận lại nội dung bàn giao và biên bản nghiệm thu.';
    if(!await db.complaint.findFirst({where:{workspaceId:w.id,reporterId:w.clientId,detail:msg}}))await db.complaint.create({data:{workspaceId:w.id,reporterId:w.clientId,detail:msg}});
  }
  console.log(`Demo ready: ${accounts.length} accounts (2 admin, 23 client, 75 freelancer), ${jobs.length} jobs, applications, 15 workspaces and SVG assets. Safe to run repeatedly.`);
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>db.$disconnect());
