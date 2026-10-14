import React,{useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {Alert,Empty} from './Layout';
import {api} from '../lib/api';
import {useApp} from '../context/AppContext';
export default function Invitations(){
  const {user}=useApp(),[items,setItems]=useState([]),[error,setError]=useState(''),[success,setSuccess]=useState(''),[busy,setBusy]=useState('');
  const load=()=>api('/invitations/mine').then(r=>setItems(r.items)).catch(e=>setError(e.message));
  useEffect(()=>{load()},[]);
  async function respond(id,action){setBusy(id);setError('');try{const r=await api(`/invitations/${id}/respond`,{method:'POST',body:{action}});setSuccess(r.notice);await load()}catch(e){setError(e.message)}finally{setBusy('')}}
  return <section className="workspace-section"><h2>{user.role==='FREELANCER'?'Lời mời hợp tác đã nhận':'Lời mời hợp tác đã gửi'}</h2><Alert error={error} success={success}/>{!items.length?<p className="muted">Chưa có lời mời.</p>:<div className="dashboard-list">{items.map(i=><div key={i.id} className="dashboard-item"><div><span className="eyebrow">{i.status}</span><h3><Link to={'/jobs/'+i.job.id}>{i.job.title}</Link></h3><p className="muted small">{user.role==='CLIENT'?'Gửi tới: '+i.freelancer.fullName:'Từ: '+i.client.fullName}</p><p>{i.message}</p></div>{i.status==='PENDING'&&user.role==='FREELANCER'&&i.job.status==='PUBLISHED'&&<div className="form-row"><button disabled={!!busy} className="btn btn-primary btn-small" onClick={()=>respond(i.id,'ACCEPTED')}>Quan tâm</button><button disabled={!!busy} className="btn btn-outline btn-small" onClick={()=>respond(i.id,'DECLINED')}>Từ chối</button></div>}</div>)}</div>}</section>;
}
