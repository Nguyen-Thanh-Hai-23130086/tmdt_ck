/* Guest discovery: real public API when available; otherwise visibly marked sample data. */
(async function(){
 if(typeof jobs==='undefined'||typeof candidates==='undefined')return;
 // Preserve source transparency without a conspicuous public header banner.
 function indicate(source){const locations=[document.querySelector('.list-section .section-heading p'),document.querySelector('.content-section .section-heading p')].filter(Boolean);for(const element of locations){element.dataset.source=source;element.title=source==='demo'?'Dữ liệu minh họa, chưa được lấy từ MySQL':'Dữ liệu từ API công khai';let badge=element.parentElement.querySelector('.tm-data-source');if(!badge){badge=document.createElement('span');badge.className='tm-data-source';element.parentElement.append(badge);}badge.textContent=source==='demo'?'Dữ liệu minh họa':'Dữ liệu từ hệ thống';}}
 indicate('demo');
 try{
  const [a,b]=await Promise.all([fetch('../api/data/jobs'),fetch('../api/data/freelancers')]);if(!a.ok||!b.ok) return;
  const j=await a.json(),c=await b.json();if(!Array.isArray(j.items)||!Array.isArray(c.items))return;
  const mappedJobs=j.items.map(x=>({id:String(x.id),title:x.title,company:'Client #'+x.ownerId,type:'Freelance',location:x.location||'Remote',salary:Number(x.amount)||0,skills:(x.skill||'Chưa cập nhật').split(/,\s*/),posted:'Mới cập nhật',deadline:x.dueDate||'Liên hệ',sold:0,description:x.content,requirements:['Trao đổi trực tiếp với Client'],benefits:['Theo thỏa thuận'],reviews:[]}));
  const mappedPeople=c.items.map(x=>({id:String(x.id),name:x.title,title:x.headline||'Freelancer',location:'Việt Nam',experience:1,expectedSalary:0,skills:(x.skill||'Chưa cập nhật').split(/,\s*/),status:'Đang hoạt động',summary:x.content||'Chưa có mô tả',projects:[x.portfolio||'Portfolio đang cập nhật']}));
  jobs.splice(0,jobs.length,...mappedJobs);candidates.splice(0,candidates.length,...mappedPeople);
  [renderHome,initJobsPage,initCandidatesPage,initJobDetailPage,initCandidateDetailPage].forEach(fn=>{try{fn()}catch(error){console.error('Render failed',error)}});
  indicate('api');
 }catch{} // static demo server: no API, do not misrepresent data
})();
