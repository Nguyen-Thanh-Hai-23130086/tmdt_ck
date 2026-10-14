import React,{useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {api} from '../lib/api';
export default function JobMatches({jobId}){
  const [items,setItems]=useState([]),[error,setError]=useState('');
  useEffect(()=>{api('/jobs/'+jobId+'/matches').then(r=>setItems(r.items)).catch(e=>setError(e.message))},[jobId]);
  return <section className="workspace-section"><h2>Freelancer phù hợp theo quy tắc</h2><p className="muted small">Điểm dựa trên kỹ năng trùng, mức giá tham khảo và kinh nghiệm; đây không phải mô hình AI.</p>{error&&<p className="alert error">{error}</p>}<div className="dashboard-list">{items.slice(0,6).map(m=><div className="dashboard-item" key={m.id}><div><h3><Link to={'/freelancers/'+m.id}>{m.fullName}</Link></h3><p className="muted small">{m.headline} · {m.explanation}</p></div><strong>{m.score}/100</strong></div>)}</div></section>;
}
