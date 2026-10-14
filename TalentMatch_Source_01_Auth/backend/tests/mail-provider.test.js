import test from 'node:test';
import assert from 'node:assert/strict';
import {sendAccountEmail,buildAccountEmail} from '../src/lib/mail.js';

test('verification and reset emails use correct frontend links',()=>{
  process.env.FRONTEND_URL='http://localhost:5173';
  const verify=buildAccountEmail('a@example.com','VERIFY','a+fake/token');
  const reset=buildAccountEmail('a@example.com','RESET','b_fake');
  assert.match(verify.text,/\/verify-email\?token=a%2Bfake%2Ftoken/);
  assert.match(reset.text,/\/reset-password\?token=b_fake/);
  assert.ok(!verify.html.includes('a+fake/token'));
});

test('Resend adapter checks acknowledgement, idempotency and failure without real API',async()=>{
  const prev={provider:process.env.MAIL_PROVIDER,key:process.env.RESEND_API_KEY,from:process.env.MAIL_FROM};
  const original=globalThis.fetch;
  process.env.MAIL_PROVIDER='resend';process.env.RESEND_API_KEY='fake-testing-only';process.env.MAIL_FROM='TalentMatch <hello@example.com>';
  let sent=0;
  try{
    globalThis.fetch=async(url,opts)=>{sent++;assert.equal(url,'https://api.resend.com/emails');assert.match(opts.headers['Idempotency-Key'],/^tm-verify-[a-f0-9]{64}$/);return new Response(JSON.stringify({id:'accepted-id'}),{status:200});};
    assert.equal((await sendAccountEmail('to@example.com','VERIFY','mock-token')).accepted,true);assert.equal(sent,1);
    globalThis.fetch=async()=>new Response(JSON.stringify({message:'reject'}),{status:403});
    await assert.rejects(sendAccountEmail('to@example.com','VERIFY','mock-token'),/HTTP 403/);
    globalThis.fetch=async()=>new Response('{}',{status:200});
    await assert.rejects(sendAccountEmail('to@example.com','RESET','mock-token'),/acknowledge/);
  }finally{
    globalThis.fetch=original;
    for(const [k,value] of Object.entries({MAIL_PROVIDER:prev.provider,RESEND_API_KEY:prev.key,MAIL_FROM:prev.from})) {if(value===undefined)delete process.env[k];else process.env[k]=value;}
  }
});
