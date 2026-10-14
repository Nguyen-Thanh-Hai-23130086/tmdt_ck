import nodemailer from 'nodemailer';
import {createHash} from 'node:crypto';
const sha=value=>createHash('sha256').update(value).digest('hex');

// Configure MAIL_PROVIDER=smtp (Mailpit or real SMTP) or resend (HTTPS API).
// A provider acceptance is not a guarantee of final inbox delivery.
const timeout = () => Math.max(1000, Number(process.env.MAIL_TIMEOUT_MS || 10000));
export function mailTransport(){
  const port=Number(process.env.SMTP_PORT||1025);
  return nodemailer.createTransport({
    host:process.env.SMTP_HOST||'localhost',port,
    secure:process.env.SMTP_SECURE==='true',
    connectionTimeout:timeout(),greetingTimeout:timeout(),socketTimeout:timeout(),
    ...(process.env.SMTP_USER?{auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD||''}}:{})
  });
}
export function buildAccountEmail(to,purpose,token){
  if(!['VERIFY','RESET'].includes(purpose)) throw new Error('Unsupported email purpose');
  const origin=process.env.FRONTEND_URL||'http://localhost:5173';
  const relative=purpose==='VERIFY'?'verify-email':'reset-password';
  const link=new URL(`/${relative}?token=${encodeURIComponent(token)}`,origin).toString();
  const title=purpose==='VERIFY'?'Xác minh email TalentMatch':'Đặt lại mật khẩu TalentMatch';
  return {from:process.env.MAIL_FROM||'TalentMatch <no-reply@talentmatch.local>',to,subject:title,
    text:`${title}\n\nMở liên kết (có thời hạn): ${link}\n\nNếu bạn không yêu cầu, hãy bỏ qua email này.`,
    html:`<div style="font-family:Arial,sans-serif;max-width:560px;padding:25px"><h2>${title}</h2><p>Liên kết bên dưới có thời hạn và chỉ dùng được một lần.</p><a href="${link.replaceAll('&','&amp;')}">Tiếp tục với TalentMatch</a><p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p></div>`};
}
export async function sendAccountEmail(to,purpose,token){
  const message=buildAccountEmail(to,purpose,token);
  const provider=(process.env.MAIL_PROVIDER||'smtp').toLowerCase();
  if(provider==='smtp'){
    const transport=mailTransport();
    try{
      const result=await transport.sendMail(message);
      if(result.rejected?.length || !result.accepted?.length) throw Object.assign(new Error('SMTP recipient was not accepted'),{code:'SMTP_NOT_ACCEPTED'});
      return {provider:'smtp',accepted:true};
    }finally{transport.close()}
  }
  if(provider==='resend'){
    if(!process.env.RESEND_API_KEY)throw new Error('RESEND_API_KEY not configured');
    if(!process.env.MAIL_FROM || process.env.MAIL_FROM.includes('.local'))throw new Error('MAIL_FROM must be an authorized sender');
    const {to,from,subject,html,text}=message;
    const response=await fetch('https://api.resend.com/emails',{
      method:'POST',signal:AbortSignal.timeout(timeout()),
      headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`tm-${purpose.toLowerCase()}-${sha(token)}`},
      body:JSON.stringify({from,to:[to],subject,html,text})
    });
    if(!response.ok)throw Object.assign(new Error(`Resend rejected request (HTTP ${response.status})`),{code:`RESEND_HTTP_${response.status}`});
    const body=await response.json();
    if(!body?.id)throw Object.assign(new Error('Resend did not acknowledge email'),{code:'RESEND_NO_ACK'});
    return {provider:'resend',accepted:true};
  }
  throw new Error('Unsupported MAIL_PROVIDER');
}
