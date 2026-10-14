import test from 'node:test';
import assert from 'node:assert/strict';
const enabled=process.env.RUN_API_TESTS==='1';
const base=process.env.TEST_API_URL||'http://localhost:4000/api';
async function request(path,options={}){
  const response=await fetch(base+path,{...options,headers:{'Content-Type':'application/json',Origin:'http://localhost:5173',...options.headers}});
  const data=await response.json();return {response,data,cookie:response.headers.get('set-cookie')?.split(';')[0]};
}
test('live API smoke: login, role boundary, guest boundary, validation', {skip:!enabled}, async()=>{
  const health=await request('/health'); assert.equal(health.response.status,200);
  const wrong=await request('/auth/login',{method:'POST',body:JSON.stringify({email:'admin@talentmatch.local',password:'definitely-wrong'})});assert.equal(wrong.response.status,401);
  const guest=await request('/admin/stats');assert.equal(guest.response.status,401);
  const freelancer=await request('/auth/login',{method:'POST',body:JSON.stringify({email:'freelancer@talentmatch.local',password:'FreelancerDemo!2026'})});assert.equal(freelancer.response.status,200);
  const forbidden=await request('/admin/stats',{headers:{Cookie:freelancer.cookie}});assert.equal(forbidden.response.status,403);
  const client=await request('/auth/login',{method:'POST',body:JSON.stringify({email:'client@talentmatch.local',password:'ClientDemo!2026'})});assert.equal(client.response.status,200);
  const invalid=await request('/jobs',{method:'POST',headers:{Cookie:client.cookie},body:JSON.stringify({title:'short',description:'invalid',budget:0,skills:[]})});assert.equal(invalid.response.status,400);
});
