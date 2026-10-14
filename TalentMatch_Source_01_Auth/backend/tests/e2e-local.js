// Local-only integration smoke. Requires running API + seeded PostgreSQL.
// Creates a new demo project; does not reset or delete existing records.
import assert from 'node:assert/strict';
const BASE=process.env.TEST_API_URL||'http://localhost:4000/api';
if(!/^http:\/\/(localhost|127\.0\.0\.1):\d+\/api$/.test(BASE))throw Error('Only localhost API tests are allowed');
async function request(path,method='GET',body,session=''){
  const resp=await fetch(BASE+path,{method,headers:{Origin:'http://localhost:5173',...(body?{'Content-Type':'application/json'}:{}),...(session?{Cookie:session}:{})},body:body?JSON.stringify(body):undefined});
  const data=await resp.json();
  if(!resp.ok)throw Error(`${method} ${path} -> ${resp.status}: ${JSON.stringify(data)}`);
  return {data,cookie:resp.headers.get('set-cookie')?.split(';')[0]};
}
async function login(email,password){return (await request('/auth/login','POST',{email,password})).cookie}
async function main(){
  console.log('Checking database and roles...');
  assert.equal((await request('/health')).data.database,'connected');
  const admin=await login('admin@talentmatch.local','AdminDemo!2026');
  const client=await login('client@talentmatch.local','ClientDemo!2026');
  const freelancer=await login('freelancer@talentmatch.local','FreelancerDemo!2026');
  const total=(await request('/admin/stats','GET',undefined,admin)).data.users;
  assert.ok(total>=100,`Expected >=100 users but found ${total}`);
  const job=(await request('/jobs','POST',{title:'Kiểm thử E2E TalentMatch '+Date.now(),description:'Kiểm tra luồng hoàn chỉnh từ đăng tuyển đến nghiệm thu bàn giao và giao dịch mô phỏng trong môi trường development.',budget:6000000,skills:['React','Node.js']},client)).data.job;
  const application=(await request(`/jobs/${job.id}/apply`,'POST',{coverLetter:'Tôi có thể thực hiện dự án theo yêu cầu và cam kết bàn giao đầy đủ.',bid:5000000,days:14},freelancer)).data.application;
  const workspace=(await request(`/jobs/${job.id}/accept/${application.id}`,'POST',undefined,client)).data.workspace;
  const milestone=(await request(`/workspaces/${workspace.id}/milestones`,'POST',{title:'Bàn giao bản E2E',description:'Kiểm thử nghiệp vụ',amount:5000000},client)).data.milestone;
  await request(`/workspaces/${workspace.id}/messages`,'POST',{body:'Chúng ta bắt đầu dự án kiểm thử.'},client);
  await request(`/workspaces/${workspace.id}/milestones/${milestone.id}/submit`,'POST',{deliverable:'Bản demo và tài liệu bàn giao đã được chuẩn bị.'},freelancer);
  await request(`/workspaces/${workspace.id}/milestones/${milestone.id}/review`,'POST',{action:'APPROVED'},client);
  await request(`/workspaces/${workspace.id}/complete`,'POST',undefined,client);
  await request(`/workspaces/${workspace.id}/payment-demo`,'POST',undefined,client);
  await request(`/workspaces/${workspace.id}/reviews`,'POST',{rating:5,comment:'Chất lượng đáp ứng đầy đủ yêu cầu trong dự án kiểm thử.'},client);
  const final=(await request(`/workspaces/${workspace.id}`,'GET',undefined,freelancer)).data.workspace;
  assert.equal(final.job.status,'COMPLETED');
  assert.equal(final.milestones[0].status,'APPROVED');
  assert.equal(final.transactions[0].status,'PAID_DEMO');
  assert.ok(final.messages.length>=1);
  console.log('PASS: role login, posting, application, acceptance, workspace, chat, delivery, review, demo payment.');
}
main().catch(e=>{console.error('FAIL:',e.message);process.exitCode=1});
