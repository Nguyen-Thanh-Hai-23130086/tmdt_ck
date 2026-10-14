import React,{useEffect,useRef,useState} from 'react';
import {Link,useSearchParams} from 'react-router-dom';
import {ArrowRight,MailCheck} from 'lucide-react';
import {api} from '../lib/api';
import {Alert,PageHeader} from '../components/Layout';

export function VerifyEmail(){
  const [p]=useSearchParams(),token=p.get('token');
  const [state,setState]=useState('loading'),[error,setError]=useState(''),started=useRef(false);
  useEffect(()=>{if(started.current)return;started.current=true;if(!token){setState('missing');return;}api('/auth/verify-email',{method:'POST',body:{token}}).then(()=>setState('success')).catch(e=>{setError(e.message);setState('error')});},[token]);
  return <div className="container narrow-page"><PageHeader eyebrow="EMAIL VERIFICATION" title="Xác minh địa chỉ email"/><div className="form-panel"><MailCheck size={42}/>{state==='loading'&&<p>Đang xác minh liên kết...</p>}{state==='missing'&&<p>Không tìm thấy mã xác minh.</p>}{state==='success'&&<Alert success="Xác minh thành công. Bạn có thể đăng nhập."/>}{state==='error'&&<Alert error={error}/>}<Link to="/login" className="btn btn-primary">Đến trang đăng nhập <ArrowRight size={16}/></Link></div></div>;
}
export function CheckEmail(){
  const [p]=useSearchParams(),[email,setEmail]=useState(p.get('email')||''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[success,setSuccess]=useState('');
  async function submit(e){e.preventDefault();setBusy(true);setError('');try{const r=await api('/auth/resend-verification',{method:'POST',body:{email}});setSuccess(r.message)}catch(e){setError(e.message)}finally{setBusy(false)}}
  return <div className="container narrow-page"><PageHeader eyebrow="EMAIL VERIFICATION" title="Kiểm tra hộp thư" description="Kiểm tra hộp thư đến và thư rác. Nếu dùng Mailpit để phát triển local, mở http://localhost:8025. Có thể gửi lại liên kết sau 60 giây."/><div className="form-panel"><Alert error={p.get('delivery')==='failed'?'Máy chủ chưa gửi được email. Hãy kiểm tra cấu hình SMTP/Resend và dùng nút gửi lại.':p.get('oauth')==='verify_required'?'Xác minh địa chỉ email trước khi có thể đăng nhập qua Facebook.':error} success={success}/><form className="stack-form" onSubmit={submit}><label>Email đăng ký<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><button disabled={busy} className="btn btn-primary">{busy?'Đang gửi...':'Gửi lại liên kết xác minh'}</button></form></div></div>;
}
export function ForgotPassword(){
  const [email,setEmail]=useState(''),[error,setError]=useState(''),[success,setSuccess]=useState(''),[busy,setBusy]=useState(false);
  async function submit(e){e.preventDefault();setBusy(true);setError('');try{const r=await api('/auth/forgot-password',{method:'POST',body:{email}});setSuccess(r.message)}catch(e){setError(e.message)}finally{setBusy(false)}}
  return <div className="container narrow-page"><PageHeader eyebrow="ACCOUNT RECOVERY" title="Quên mật khẩu" description="Nhập email tài khoản của bạn. Liên kết đặt lại có hiệu lực trong 30 phút."/><div className="form-panel"><Alert error={error} success={success}/><form className="stack-form" onSubmit={submit}><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><button disabled={busy} className="btn btn-primary">{busy?'Đang gửi...':'Gửi liên kết đặt lại'}</button></form><p><Link to="/login">Quay về đăng nhập</Link></p></div></div>;
}
export function ResetPassword(){
  const [p]=useSearchParams(),token=p.get('token');
  const [pass,setPass]=useState(''),[confirm,setConfirm]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[success,setSuccess]=useState('');
  async function submit(e){e.preventDefault();setError('');if(pass!==confirm)return setError('Mật khẩu nhập lại không khớp');setBusy(true);try{const r=await api('/auth/reset-password',{method:'POST',body:{token,password:pass}});setSuccess(r.message);setPass('');setConfirm('')}catch(e){setError(e.message)}finally{setBusy(false)}}
  return <div className="container narrow-page"><PageHeader eyebrow="ACCOUNT RECOVERY" title="Tạo mật khẩu mới" description="Mật khẩu ít nhất 10 ký tự, gồm chữ cái và chữ số."/><div className="form-panel"><Alert error={!token?'Liên kết đặt lại mật khẩu không hợp lệ.':error} success={success}/>{!success&&<form className="stack-form" onSubmit={submit}><label>Mật khẩu mới<input type="password" autoComplete="new-password" required minLength={10} value={pass} onChange={e=>setPass(e.target.value)}/></label><label>Nhập lại mật khẩu<input type="password" autoComplete="new-password" required minLength={10} value={confirm} onChange={e=>setConfirm(e.target.value)}/></label><button disabled={busy||!token} className="btn btn-primary">{busy?'Đang lưu...':'Đặt lại mật khẩu'}</button></form>}<p><Link to="/login">Đăng nhập</Link></p></div></div>;
}
