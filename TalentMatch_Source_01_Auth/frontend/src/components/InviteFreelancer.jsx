import React,{useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {api} from '../lib/api';
import {Alert} from './Layout';
import {useApp} from '../context/AppContext';
export default function InviteFreelancer({freelancerId}){
  const {user}=useApp(),[jobs,setJobs]=useState([]),[jobId,setJobId]=useState(''),[message,setMessage]=useState('Chào bạn, tôi thấy kỹ năng của bạn phù hợp với dự án của chúng tôi. Hãy xem chi tiết và phản hồi nếu quan tâm.'),[error,setError]=useState(''),[success,setSuccess]=useState(''),[busy,setBusy]=useState(false);
  useEffect(()=>{if(user?.role==='CLIENT')api('/jobs/mine').then(r=>{const list=r.items.filter(j=>j.status==='PUBLISHED');setJobs(list);setJobId(list[0]?.id||'')}).catch(e=>setError(e.message))},[user?.role]);
  if(!user)return <Link className="btn btn-primary" to="/login">Đăng nhập để hợp tác</Link>;
  if(user.role!=='CLIENT')return null;
  async function send(e){e.preventDefault();setBusy(true);setError('');setSuccess('');try{await api('/invitations',{method:'POST',body:{jobId,freelancerId,message}});setSuccess('Đã gửi lời mời. Freelancer có thể phản hồi trong dashboard.')}catch(e){setError(e.message)}finally{setBusy(false)}}
  return <div className="invite-widget"><h3>Mời freelancer hợp tác</h3><Alert error={error} success={success}/>{jobs.length?<form onSubmit={send} className="stack-form"><label>Chọn dự án đang tuyển<select required value={jobId} onChange={e=>setJobId(e.target.value)}>{jobs.map(j=><option key={j.id} value={j.id}>{j.title}</option>)}</select></label><label>Lời mời<textarea required minLength={15} value={message} onChange={e=>setMessage(e.target.value)} rows={3}/></label><button disabled={busy} className="btn btn-primary">{busy?'Đang gửi...':'Gửi lời mời'}</button></form>:<p className="muted">Bạn cần có một dự án đang tuyển. <Link to="/jobs/new">Đăng dự án mới</Link></p>}</div>
}
