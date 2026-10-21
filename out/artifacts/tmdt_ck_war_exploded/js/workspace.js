/* TalentMatch workspace: same technology as original project, progressive enhancement.
   DEMO is visibly distinct from API mode. Demo changes never claim MySQL writes. */
(() => {
 'use strict';
 const $=id=>document.getElementById(id), esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const money=value=>new Intl.NumberFormat('vi-VN').format(Number(value)||0)+' đ';
 const qs=new URLSearchParams(location.search);
 const sections={
  FREELANCER:[['dashboard','Tổng quan'],['profile','Hồ sơ, CV & portfolio'],['settings','Cài đặt tài khoản'],['jobs','Tìm công việc'],['applications','Đơn ứng tuyển & proposal'],['invitations','Lời mời làm việc'],['agreements','Thỏa thuận'],['projects','Dự án của tôi'],['milestones','Tiến độ & bàn giao'],['messages','Tin nhắn'],['payments','Thanh toán'],['reviews','Đánh giá'],['credits','TalentCredit'],['premium','Gói Premium'],['reports','Báo cáo & khiếu nại'],['notifications','Thông báo']],
  CLIENT:[['dashboard','Tổng quan'],['company','Hồ sơ doanh nghiệp'],['settings','Cài đặt tài khoản'],['jobs','Quản lý tin tuyển dụng'],['freelancers','Tìm Freelancer'],['applications','Proposal & báo giá'],['invitations','Lời mời đã gửi'],['agreements','Thỏa thuận'],['projects','Quản lý dự án'],['milestones','Mốc tiến độ & nghiệm thu'],['messages','Tin nhắn'],['payments','Thanh toán'],['reviews','Đánh giá Freelancer'],['credits','TalentCredit'],['premium','Gói Premium'],['reports','Tranh chấp'],['notifications','Thông báo']],
  ADMIN:[['dashboard','Thống kê hoạt động'],['settings','Cài đặt tài khoản'],['users','Quản lý tài khoản'],['jobs','Kiểm duyệt tin đăng'],['freelancers','Hồ sơ Freelancer'],['applications','Đơn ứng tuyển'],['invitations','Lời mời'],['agreements','Thỏa thuận'],['projects','Quản lý dự án'],['milestones','Mốc tiến độ'],['messages','Tin nhắn'],['payments','Giao dịch'],['reviews','Đánh giá'],['credits','TalentCredit'],['reports','Báo cáo & tranh chấp'],['categories','Danh mục & kỹ năng'],['premium','Gói Premium'],['policies','Điều khoản & chính sách'],['notifications','Thông báo']]
 };
 const navGroups={
  FREELANCER:[{id:'dashboard',label:'Tổng quan',icon:'◫',items:['dashboard']},{id:'connections',label:'Kết nối & thỏa thuận',icon:'◇',items:['applications','invitations','agreements']},{id:'project-center',label:'Quản lý dự án',icon:'▤',items:['projects','milestones','messages','payments','reviews']},{id:'reports',label:'Hỗ trợ & tranh chấp',icon:'♧',items:['reports']}],
  CLIENT:[{id:'dashboard',label:'Tổng quan',icon:'◫',items:['dashboard']},{id:'company',label:'Hồ sơ doanh nghiệp',icon:'♙',items:['company']},{id:'recruiting',label:'Tuyển dụng & tìm người',icon:'▣',items:['jobs','freelancers']},{id:'connections',label:'Kết nối & thỏa thuận',icon:'◇',items:['applications','invitations','agreements']},{id:'project-center',label:'Quản lý dự án',icon:'▤',items:['projects','milestones','messages','payments','reviews']},{id:'reports',label:'Tranh chấp & hỗ trợ',icon:'♧',items:['reports']}],
  ADMIN:[{id:'dashboard',label:'Tổng quan quản trị',icon:'◫',items:['dashboard']},{id:'admin-users',label:'Quản lý người dùng',icon:'♙',items:['users','freelancers']},{id:'admin-recruitment',label:'Tuyển dụng & nội dung',icon:'▣',items:['jobs','applications','invitations','agreements']},{id:'admin-projects',label:'Dự án & giao dịch',icon:'▤',items:['projects','milestones','messages','payments','credits']},{id:'admin-moderation',label:'Đánh giá & tranh chấp',icon:'⚑',items:['reviews','reports']},{id:'admin-catalog',label:'Danh mục & gói tài khoản',icon:'◈',items:['categories','premium']},{id:'admin-settings',label:'Cấu hình & thông báo',icon:'⚙',items:['policies','notifications']}]
 };
 const tabNames={applications:'Ứng tuyển & proposal',invitations:'Lời mời',agreements:'Thỏa thuận',projects:'Dự án',milestones:'Milestone & bàn giao',messages:'Tin nhắn',payments:'Thanh toán',reviews:'Đánh giá',users:'Tài khoản',freelancers:'Hồ sơ Freelancer',jobs:'Tin tuyển dụng',categories:'Danh mục & kỹ năng',credits:'TalentCredit',premium:'Gói tài khoản',reports:'Báo cáo & tranh chấp',policies:'Điều khoản & chính sách'};
 function groupFor(kind){return (navGroups[role]||[]).find(group=>group.items.includes(kind));}
 const cfg={
  jobs:{label:'Công việc',fields:['title','content','amount','skill','location'],states:['OPEN','PAUSED','CLOSED']},
  applications:{label:'Ứng tuyển / proposal',fields:['title','content','amount','jobId'],states:['PENDING','SHORTLISTED','ACCEPTED','REJECTED']},
  invitations:{label:'Lời mời',fields:['title','content','target','amount'],states:['PENDING','ACCEPTED','REJECTED','CANCELLED']},
  agreements:{label:'Thỏa thuận',fields:['title','content','amount','target'],states:['DRAFT','SIGNED','CANCELLED']},
  projects:{label:'Dự án',fields:['title','content','target','amount'],states:['IN_PROGRESS','REVIEW','COMPLETED']},
  milestones:{label:'Milestone',fields:['title','content','projectId','amount','dueDate'],states:['TODO','IN_PROGRESS','SUBMITTED','REVISION','ACCEPTED']},
  messages:{label:'Tin nhắn',fields:['title','content','target'],states:['SENT','READ']},
  payments:{label:'Thanh toán (theo dõi)',fields:['title','content','amount'],states:['PENDING','RECORDED','CANCELLED']},
  reviews:{label:'Đánh giá',fields:['title','content','target','rating'],states:['PUBLISHED','HIDDEN']},
  credits:{label:'TalentCredit',fields:['title','content','amount'],states:['PENDING','APPROVED']},
  premium:{label:'Gói Premium',fields:['title','content','amount'],states:['AVAILABLE','REQUESTED','ACTIVE']},
  reports:{label:'Báo cáo / khiếu nại',fields:['title','content','target'],states:['OPEN','INVESTIGATING','RESOLVED','REJECTED']},
  notifications:{label:'Thông báo',fields:['title','content'],states:['UNREAD','READ']},
  categories:{label:'Danh mục / kỹ năng',fields:['title','content'],states:['ACTIVE','HIDDEN']},
  policies:{label:'Điều khoản',fields:['title','content'],states:['DRAFT','PUBLISHED']},
  freelancers:{label:'Freelancer',fields:['title','content','skill'],states:['ACTIVE']},
  users:{label:'Người dùng',fields:[],states:['ACTIVE','SUSPENDED']}
 };
 const fieldLabels={title:'Tiêu đề',content:'Nội dung / mô tả',amount:'Giá trị (VND)',skill:'Kỹ năng',location:'Địa điểm',jobId:'Mã công việc',projectId:'Mã dự án',target:'Email / người nhận',rating:'Số sao (1–5)',dueDate:'Hạn hoàn thành'};
 const roleLabels={FREELANCER:'Freelancer',CLIENT:'Nhà tuyển dụng',ADMIN:'Quản trị viên'};
 const demoSeed={
  jobs:[{id:101,title:'Thiết kế giao diện website thương mại',content:'Xây dựng giao diện responsive, bàn giao bản thiết kế và mã nguồn.',amount:12000000,skill:'HTML, CSS, JavaScript',location:'Remote',status:'OPEN',ownerId:2},{id:102,title:'Lập trình Java Web cho hệ thống quản lý',content:'Servlet, MySQL, phân quyền và bảng dữ liệu.',amount:26000000,skill:'Java, MySQL',location:'TP.HCM',status:'OPEN',ownerId:3},{id:103,title:'Báo cáo dữ liệu Power BI',content:'Phân tích dữ liệu và xây dashboard.',amount:8500000,skill:'SQL, Power BI',location:'Hà Nội',status:'OPEN',ownerId:4}],
  applications:[{id:201,title:'Proposal giao diện website thương mại',content:'Thiết kế 3 trang responsive, thời gian 14 ngày.',amount:11000000,jobId:101,status:'PENDING',ownerId:7},{id:202,title:'Proposal Java Web',content:'Xây dựng module hồ sơ và cơ sở dữ liệu.',amount:24500000,jobId:102,status:'SHORTLISTED',ownerId:8}],
  invitations:[{id:301,title:'Mời thực hiện dự án UI',content:'Mời hợp tác theo milestone.',target:'freelancer07@talentmatch.test',status:'PENDING',ownerId:2}],
  agreements:[{id:401,title:'Thỏa thuận dự án UI',content:'Hai lần bàn giao, nghiệm thu từng mốc.',amount:11000000,target:'freelancer07@talentmatch.test',status:'DRAFT',ownerId:2}],
  projects:[{id:501,title:'Website đặt lịch tư vấn',content:'Thiết kế giao diện và tích hợp backend.',amount:22000000,target:'freelancer07@talentmatch.test',status:'IN_PROGRESS',ownerId:2}],
  milestones:[{id:601,title:'Bàn giao wireframe',content:'File Figma và mô tả tương tác.',projectId:501,amount:8000000,dueDate:'2026-11-05',target:'freelancer07@talentmatch.test',status:'SUBMITTED',ownerId:2},{id:602,title:'Bàn giao giao diện responsive',content:'HTML/CSS/JavaScript đầy đủ.',projectId:501,amount:14000000,dueDate:'2026-11-20',target:'freelancer07@talentmatch.test',status:'IN_PROGRESS',ownerId:2}],
  messages:[{id:701,title:'NovaTech',content:'Chào bạn! Chúng tôi muốn trao đổi về proposal.',target:'client01@talentmatch.test',status:'SENT',ownerId:7}],
  payments:[{id:801,title:'Thanh toán milestone wireframe',content:'Bản ghi theo dõi, không chuyển tiền thật.',amount:8000000,target:'freelancer07@talentmatch.test',status:'PENDING',ownerId:2}],
  reviews:[{id:901,title:'Hợp tác chuyên nghiệp',content:'Giao tiếp rõ ràng, tiến độ tốt.',rating:5,target:'freelancer07@talentmatch.test',status:'PUBLISHED',ownerId:2}],
  credits:[{id:1001,title:'Điểm hoạt động demo',content:'Chỉ là điểm thử nghiệm trong trình duyệt.',amount:120,status:'APPROVED',ownerId:7}],
  premium:[{id:1101,title:'Premium Freelancer',content:'Giao diện xem trước gói nâng cấp.',amount:99000,status:'AVAILABLE',ownerId:0},{id:1102,title:'Premium Client',content:'Bộ công cụ tìm kiếm nâng cao, bản demo.',amount:199000,status:'AVAILABLE',ownerId:0}],
  reports:[{id:1201,title:'Yêu cầu hỗ trợ tiến độ',content:'Đề nghị hỗ trợ xác nhận mốc bàn giao.',status:'OPEN',ownerId:7}],
  notifications:[{id:1301,title:'Chào mừng bạn đến TalentMatch',content:'Bắt đầu bằng cách hoàn thiện hồ sơ.',status:'UNREAD',ownerId:7}],
  categories:[{id:1401,title:'Lập trình web',content:'Java, HTML, CSS, JavaScript',status:'ACTIVE',ownerId:1},{id:1402,title:'Thiết kế',content:'UI/UX, Figma',status:'ACTIVE',ownerId:1}],
  policies:[{id:1501,title:'Quy định demo',content:'Điều khoản mẫu dành cho mục đích giảng dạy, chưa phải tài liệu pháp lý.',status:'DRAFT',ownerId:1}]
 };
 // Role-aware demo directory, identical synthetic identities to database/seed_demo.sql.
 demoSeed.users=[{id:1,title:'Quản trị viên demo',email:'admin@talentmatch.test',role:'ADMIN',status:'ACTIVE',content:'Quản trị hệ thống'},
  ...Array.from({length:5},(_,i)=>({id:i+2,title:`Doanh nghiệp mẫu ${i+1}`,email:`client${String(i+1).padStart(2,'0')}@talentmatch.test`,role:'CLIENT',status:'ACTIVE',content:'Doanh nghiệp tuyển dụng'})),
  ...Array.from({length:14},(_,i)=>({id:i+7,title:`Freelancer mẫu ${i+1}`,email:`freelancer${String(i+1).padStart(2,'0')}@talentmatch.test`,role:'FREELANCER',status:'ACTIVE',content:'Freelancer làm việc từ xa'}))];
 demoSeed.freelancers=demoSeed.users.filter(x=>x.role==='FREELANCER').map((x,i)=>({...x,skill:['Java, MySQL','React, UI/UX','SQL, Power BI','Viết nội dung'][i%4],headline:'Chuyên viên tự do',content:`Kinh nghiệm triển khai dự án ${i+1}, sẵn sàng hợp tác.`}));
 const key='tm_workspace_demo_v2';let store,mode='demo',user=null,role='FREELANCER',view='dashboard',records=[],search='',filter='all',pageNumber=1,editing=null,focusId=null,projectFocus=null,notices=[];
 try{store=JSON.parse(localStorage.getItem(key))||structuredClone(demoSeed)}catch{store=structuredClone(demoSeed)};if(!store.users||!store.freelancers){store.users=structuredClone(demoSeed.users);store.freelancers=structuredClone(demoSeed.freelancers);persistAfterSeed();}function persistAfterSeed(){try{localStorage.setItem(key,JSON.stringify(store))}catch{}}
 const persist=()=>localStorage.setItem(key,JSON.stringify(store));
 const toast=(msg,error=false)=>{const e=$('tmToast');e.textContent=msg;e.classList.toggle('tm-error',error);};
 async function api(path,options={}){const response=await fetch('../api/'+path,{credentials:'same-origin',headers:{'X-TM-Request':'1',...(options.method?{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'}:{})},...options});let json=await response.json().catch(()=>null);if(!response.ok)throw Error(json?.error||'Không thể kết nối máy chủ');return json;}
 async function setup(){
  try{const response=await fetch('../api/auth/me',{credentials:'same-origin'});if(response.ok){const data=await response.json();if(data.user){user=data.user;role=user.role;mode='api';}}}catch{}
  if(!user){role=qs.get('role')||localStorage.getItem('tm_demo_role')||'FREELANCER';if(!sections[role])role='FREELANCER';mode='demo';}
  $('modeTag').textContent=mode==='demo'?'DEMO · KHÔNG GHI MYSQL':'PHIÊN MYSQL · ĐÃ ĐĂNG NHẬP';
  $('roleSwitcher').hidden=mode==='api';$('demoRole').value=role;
  $('demoRole').addEventListener('change',event=>{role=event.target.value;localStorage.setItem('tm_demo_role',role);projectFocus=null;navigateTo('dashboard')});
  $('refreshBtn').addEventListener('click',()=>openView(view));$('createBtn').addEventListener('click',()=>openDialog());
  $('closeDialog').addEventListener('click',closeDialog);$('cancelDialog').addEventListener('click',closeDialog);$('editForm').addEventListener('submit',submitForm);
  $('notificationButton').addEventListener('click',async()=>{const opening=$('notificationMenu').hidden;closePopovers();if(opening){$('notificationMenu').hidden=false;$('notificationButton').setAttribute('aria-expanded','true');await showNotifications();}});
  $('accountButton').addEventListener('click',()=>{const opening=$('accountMenu').hidden;closePopovers();if(opening){$('accountMenu').hidden=false;$('accountButton').setAttribute('aria-expanded','true');}});
  $('accountLogout').addEventListener('click',logout);
  $('creditButton').addEventListener('click',()=>navigateTo('credits'));
  $('premiumButton').addEventListener('click',()=>navigateTo('premium'));
  $('viewAllNotifications').addEventListener('click',()=>navigateTo('notifications'));
  $('sideToggle').addEventListener('click',()=>toggleSidebar());$('sidebarBackdrop').addEventListener('click',()=>toggleSidebar(false));
  document.addEventListener('click',e=>{if(!e.target.closest('.tm-pop-anchor'))closePopovers();if(innerWidth<=830&&!e.target.closest('#workSidebar')&&!e.target.closest('#sideToggle'))toggleSidebar(false);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closePopovers();toggleSidebar(false)}});
  window.addEventListener('popstate',()=>{const params=new URLSearchParams(location.search);openView(params.get('view')||'dashboard',params.get('item'));});
  view=qs.get('view')||'dashboard';if(!sections[role].some(([name])=>name===view))view='dashboard';await openView(view,qs.get('item'));
 }
 function toggleSidebar(force){const open=force===undefined?!document.body.classList.contains('tm-sidebar-open'):force;document.body.classList.toggle('tm-sidebar-open',open);$('sideToggle').setAttribute('aria-expanded',String(open));$('sideToggle').setAttribute('aria-label',open?'Đóng menu chức năng':'Mở menu chức năng');$('sidebarBackdrop').hidden=!open;}
 function closePopovers(){for(const id of ['accountMenu','notificationMenu'])$(id).hidden=true;for(const id of ['accountButton','notificationButton'])$(id).setAttribute('aria-expanded','false');}
 async function logout(){if(mode==='api'){try{await api('auth/logout',{method:'POST'});}catch(e){toast('Không thể kết thúc phiên: '+e.message,true);return;}location.href='../login';}else location.href='../login';}
 function navigateTo(next,id){if(!['projects','milestones','messages','payments','reviews'].includes(next))projectFocus=null;const valid=(sections[role]||[]).some(([name])=>name===next);if(!valid){toast('Mục này không khả dụng với vai trò hiện tại.',true);return;}closePopovers();toggleSidebar(false);const link=new URL(location.href);link.searchParams.set('view',next);link.searchParams.delete('role');if(mode==='demo')link.searchParams.set('role',role);if(id!=null)link.searchParams.set('item',String(id));else link.searchParams.delete('item');history.pushState({},'',link.pathname+link.search);openView(next,id);}
 function navigation(){
  const name=user?.name||(mode==='demo'?'Tài khoản xem trước':'TalentMatch');const initials=user?.name?user.name.trim().split(/\s+/).slice(-2).map(w=>w[0]).join('').toUpperCase():'TM';
  $('sideName').textContent=name;$('sideRole').textContent=roleLabels[role];$('sideAvatar').textContent=initials;
  $('topAvatar').textContent=initials;$('topName').textContent=user?.name||(mode==='demo'?'Xem trước giao diện':'TalentMatch');$('topRole').textContent=roleLabels[role];
  $('menuIdentity').textContent=user?.name||'Xem trước giao diện';$('menuEmail').textContent=user?.email||'Chế độ demo';
  $('accountLogout').textContent=mode==='api'?'Đăng xuất':'Đăng nhập thật';
  $('creditAnchor').hidden=role==='ADMIN';$('premiumAnchor').hidden=role==='ADMIN';
  const links=role==='FREELANCER'?[['profile','Thông tin tài khoản & hồ sơ'],['settings','Cài đặt tài khoản'],['premium','Gói tài khoản']]:role==='CLIENT'?[['company','Hồ sơ doanh nghiệp'],['settings','Cài đặt tài khoản'],['premium','Gói tài khoản']]:[['users','Quản lý tài khoản'],['settings','Cài đặt tài khoản'],['policies','Cấu hình nền tảng']];
  $('accountLinks').innerHTML=links.map(([key,label])=>`<button type="button" class="tm-menu-link" data-account-view="${key}">${esc(label)}</button>`).join('');
  $('accountLinks').querySelectorAll('button').forEach(b=>b.onclick=()=>navigateTo(b.dataset.accountView));
  const group=groupFor(view);
  $('workNav').innerHTML=navGroups[role].map((entry,i)=>`<a href="?view=${encodeURIComponent(entry.items[0])}" data-nav="${entry.items[0]}" class="tm-navitem ${group?.id===entry.id?'active':''}" ${group?.id===entry.id?'aria-current="page"':''}><span class="tm-navicon" aria-hidden="true">${entry.icon}</span><span>${esc(entry.label)}</span></a>`).join('');
  $('workNav').querySelectorAll('[data-nav]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();navigateTo(a.dataset.nav)}));
 }
 async function load(name){
  if(mode==='demo'){
   const rows=structuredClone(store[name]||[]);if(role==='ADMIN'||name==='freelancers'||name==='users')return rows;
   const actorId=role==='CLIENT'?2:7,actorEmail=role==='CLIENT'?'client01@talentmatch.test':'freelancer07@talentmatch.test';
   if(['premium','categories','policies'].includes(name))return rows.filter(r=>['AVAILABLE','ACTIVE','PUBLISHED'].includes(r.status)||r.ownerId===actorId);
   if(name==='jobs')return role==='FREELANCER'?rows.filter(r=>r.status==='OPEN'):rows.filter(r=>r.ownerId===actorId);
   return rows.filter(r=>r.ownerId===actorId||r.target===actorEmail||(name==='applications'&&(store.jobs||[]).some(j=>Number(j.id)===Number(r.jobId)&&j.ownerId===actorId))||(name==='milestones'&&(store.projects||[]).some(pr=>Number(pr.id)===Number(r.projectId)&&(pr.ownerId===actorId||pr.target===actorEmail))));
  }
  const result=await api(`data/${encodeURIComponent(name)}`);return result.items||[];
 }
 function tabHeader(){const group=groupFor(view);if(!group||group.items.length===1)return '';
  return `<nav class="tm-tabs" aria-label="Các chức năng trong ${esc(group.label)}">${group.items.map(key=>`<a href="?view=${key}" data-tab="${key}" class="${view===key?'active':''}" ${view===key?'aria-current="page"':''}>${esc(tabNames[key]||key)}</a>`).join('')}</nav>`;
 }
 function displayMarkup(markup){$('mainContent').innerHTML=tabHeader()+`<div class="tm-view-content">${markup}</div>`;$('mainContent').querySelectorAll('[data-tab]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();navigateTo(a.dataset.tab)}));}
 async function openView(next,id=null){
  view=next;search='';filter='all';pageNumber=1;focusId=id==null?null:Number(id);toast('');
  navigation();const group=groupFor(view),leaf=tabNames[view]||sections[role].find(([name])=>name===view)?.[1]||'Tổng quan';const title=group?.items.length>1?group.label:leaf;
  $('viewTitle').textContent=title;
  $('viewSubtitle').textContent=view==='dashboard'?({FREELANCER:'Cơ hội, công việc cần làm và tiến độ của bạn.',CLIENT:'Tuyển đúng người, xử lý hồ sơ và quản lý dự án.',ADMIN:'Giám sát hoạt động và ưu tiên xử lý vấn đề nền tảng.'})[role]:group?.items.length>1?`${leaf}`:({profile:'Quản lý thông tin, CV và portfolio.',company:'Quản lý thông tin và hồ sơ doanh nghiệp.',settings:'Thông tin tài khoản và thiết lập.',reports:'Theo dõi yêu cầu hỗ trợ và tranh chấp.'})[view]||'';
  $('createBtn').hidden=['dashboard','freelancers','users','company','profile','settings'].includes(view)||(view==='jobs'&&role==='FREELANCER')||(view==='premium'&&role!=='ADMIN')||(view==='payments'&&role!=='ADMIN')||(view==='credits'&&role!=='ADMIN')||(view==='notifications'&&role!=='ADMIN')||(view==='categories'&&role!=='ADMIN')||(view==='policies'&&role!=='ADMIN')||(view==='applications'&&role!=='FREELANCER'&&role!=='ADMIN')||(view==='invitations'&&role!=='CLIENT'&&role!=='ADMIN')||(view==='agreements'&&role!=='CLIENT'&&role!=='ADMIN')||(view==='projects'&&role!=='CLIENT'&&role!=='ADMIN')||(view==='milestones'&&role!=='CLIENT'&&role!=='ADMIN');
  $('createBtn').textContent=view==='jobs'?'+ Đăng tin':'+ Tạo mới';$('refreshBtn').hidden=view==='dashboard'||view==='settings';
  try{if(['dashboard','company','profile','settings'].includes(view)){await renderSpecial();return;}records=await load(view);renderRecords();}catch(err){displayMarkup(`<div class="tm-empty"><h2>Không tải được dữ liệu</h2><p>${esc(err.message)}</p><button type="button" class="tm-ghost" id="tryAgain">Thử lại</button></div>`);$('tryAgain').onclick=()=>openView(view);toast('Lỗi: '+err.message,true);}
  updateNotificationBadge();
 }
 async function showNotifications(){const box=$('notificationItems');box.innerHTML='<p class="tm-small">Đang tải thông báo…</p>';try{notices=await load('notifications');const unread=notices.filter(n=>n.status==='UNREAD');box.innerHTML=notices.length?notices.slice(0,6).map(n=>`<button type="button" class="tm-notice ${n.status==='UNREAD'?'unread':''}" data-notice="${esc(n.id)}"><strong>${esc(n.title||'Thông báo')}</strong><small>${esc(n.content||'')}</small><span>${n.status==='UNREAD'?'Chưa đọc':'Đã đọc'}</span></button>`).join(''):'<div class="tm-empty tm-empty-small">Chưa có thông báo</div>';box.querySelectorAll('[data-notice]').forEach(b=>b.onclick=()=>navigateTo('notifications',b.dataset.notice));updateNotificationBadge(unread.length);}catch(e){box.textContent='Không tải được thông báo: '+e.message;}}
 async function updateNotificationBadge(count){try{const n=count??(await load('notifications')).filter(x=>x.status==='UNREAD').length;$('notificationDot').hidden=n===0;$('notificationButton').title=n>0?`${n} thông báo chưa đọc`:'Không có thông báo chưa đọc';}catch{$('notificationDot').hidden=true;}}
 const countState=(rows,...values)=>rows.filter(r=>values.includes(r.status)).length;
 const stat=(text,num,detail)=>`<article class="tm-stat tm-stat-new"><span>${esc(text)}</span><strong>${esc(num)}</strong><small>${esc(detail)}</small></article>`;
 const actionLink=(name,label,id)=>`<button type="button" class="tm-link-action" data-go="${esc(name)}" ${id!=null?`data-item="${esc(id)}"`:''}>${esc(label)} <span aria-hidden="true">↗</span></button>`;
 const renderTask=(badge,title,detail,next,id)=>`<article class="tm-task"><span class="tm-task-dot">${esc(badge)}</span><div><strong>${esc(title)}</strong><small>${esc(detail)}</small></div>${actionLink(next,'Xử lý',id)}</article>`;
 async function renderSpecial(){
  if(view==='settings'){
   displayMarkup(`<section class="tm-panel"><div class="tm-panel-head"><div><span class="tm-eyebrow">TÀI KHOẢN & BẢO MẬT</span><h2>Cài đặt tài khoản</h2></div></div><div class="tm-account-info"><p><strong>Họ tên:</strong> ${esc(user?.name||'Chưa đăng nhập thật (demo)')}</p><p><strong>Email:</strong> ${esc(user?.email||'Không có phiên MySQL')}</p><p><strong>Vai trò:</strong> ${esc(roleLabels[role])}</p><p><strong>Trạng thái:</strong> ${mode==='api'?'Đăng nhập với Servlet session':'Xem trước bằng dữ liệu trình duyệt'}</p></div><p class="tm-small">Đổi mật khẩu và các cấu hình bảo mật nâng cao cần API tương ứng. Chức năng này chưa được kích hoạt; không nhập mật khẩu vào biểu mẫu không được xác thực.</p><div class="tm-card-actions"><button class="tm-ghost" id="settingsProfile" type="button">${role==='ADMIN'?'Xem người dùng':role==='CLIENT'?'Hồ sơ doanh nghiệp':'Hồ sơ của tôi'}</button><button class="tm-primary" id="settingsExit" type="button">${mode==='api'?'Đăng xuất':'Đến trang đăng nhập'}</button></div></section>`);
   $('settingsProfile').onclick=()=>navigateTo(role==='ADMIN'?'users':role==='CLIENT'?'company':'profile');$('settingsExit').onclick=logout;return;
  }
  if(view==='dashboard'){
   const resourceNames=role==='ADMIN'?['users','jobs','projects','reports','applications','milestones','categories','messages']:role==='CLIENT'?['jobs','applications','invitations','agreements','projects','milestones','freelancers','messages']:['jobs','applications','invitations','agreements','projects','milestones','messages'];
   displayMarkup('<section class="tm-panel"><p class="tm-small">Đang tổng hợp dữ liệu theo vai trò…</p></section>');
   const results=await Promise.allSettled(resourceNames.map(name=>load(name)));const data={};let failed=[];resourceNames.forEach((key,index)=>{if(results[index].status==='fulfilled')data[key]=results[index].value;else{data[key]=[];failed.push(key);}});
   const arr=k=>data[k]||[],projects=arr('projects'),milestones=arr('milestones'),applications=arr('applications'),invitations=arr('invitations'),messages=arr('messages');
   const actor=mode==='demo'?(role==='CLIENT'?2:role==='ADMIN'?1:7):user?.id;
   const username=user?.name||(mode==='demo'?'bạn (chế độ xem trước)':'bạn');
   let metrics=[],tasks=[],opportunities=[],searchTarget='',searchHint='',summaryTitle='Dự án đang thực hiện';
   if(role==='FREELANCER'){
    searchTarget='jobs.html';searchHint='Tìm công việc, kỹ năng hoặc từ khóa...';
    metrics=[['Công việc đang mở',arr('jobs').filter(j=>j.status==='OPEN').length,'Cơ hội hiện có'],['Proposal đang chờ',countState(applications,'PENDING','SHORTLISTED'),'Đang đợi phản hồi'],['Lời mời mới',countState(invitations,'PENDING'),'Cần phản hồi'],['Dự án đang chạy',countState(projects,'IN_PROGRESS','REVIEW'),'Đang thực hiện']];
    tasks.push(...invitations.filter(r=>r.status==='PENDING').map(r=>['✉','Lời mời cần phản hồi',r.title,'invitations',r.id]));
    tasks.push(...arr('agreements').filter(r=>r.status==='DRAFT'&&!r.freelancerApproved).map(r=>['◇','Xác nhận thỏa thuận',r.title,'agreements',r.id]));
    tasks.push(...milestones.filter(r=>['IN_PROGRESS','REVISION'].includes(r.status)).map(r=>['◷',r.status==='REVISION'?'Cần chỉnh sửa bàn giao':'Milestone cần bàn giao',r.title,'milestones',r.id]));
    tasks.push(...applications.filter(r=>r.status==='ACCEPTED').map(r=>['✓','Proposal đã được chọn',r.title,'applications',r.id]));
    let skills='';try{skills=(JSON.parse(localStorage.getItem('tm_profile_freelancer')||'{}')?.skills||'');}catch{}
    const tokens=skills.toLowerCase().split(/[,;/]+/).map(x=>x.trim()).filter(x=>x.length>1);
    opportunities=arr('jobs').filter(r=>r.status==='OPEN').sort((a,b)=>tokens.some(t=>`${a.skill||''} ${a.title||''}`.toLowerCase().includes(t))?-1:1).slice(0,3);
   }else if(role==='CLIENT'){
    searchTarget='candidates.html';searchHint='Tìm Freelancer theo tên hoặc kỹ năng...';
    metrics=[['Tin tuyển dụng mở',countState(arr('jobs'),'OPEN'),'Bài đăng của bạn'],['Proposal cần phản hồi',countState(applications,'PENDING','SHORTLISTED'),'Đang chờ chọn'],['Lời mời đang chờ',countState(invitations,'PENDING'),'Đã gửi'],['Dự án đang chạy',countState(projects,'IN_PROGRESS','REVIEW'),'Đang theo dõi']];
    tasks.push(...applications.filter(r=>['PENDING','SHORTLISTED'].includes(r.status)).map(r=>['◎','Đánh giá proposal',r.title,'applications',r.id]));
    tasks.push(...arr('agreements').filter(r=>r.status==='DRAFT'&&!r.clientApproved).map(r=>['◇','Cần xác nhận thỏa thuận',r.title,'agreements',r.id]));
    tasks.push(...milestones.filter(r=>r.status==='SUBMITTED').map(r=>['◷','Bàn giao chờ nghiệm thu',r.title,'milestones',r.id]));
    opportunities=arr('freelancers').slice(0,3);
   }else{
    summaryTitle='Hoạt động gần đây';
    metrics=[['Tổng tài khoản',arr('users').length,'Toàn hệ thống'],['Freelancer',arr('users').filter(r=>r.role==='FREELANCER').length,'Tài khoản Freelancer'],['Client',arr('users').filter(r=>r.role==='CLIENT').length,'Tài khoản doanh nghiệp'],['Báo cáo chờ xử lý',countState(arr('reports'),'OPEN','INVESTIGATING'),'Cần xem xét']];
    tasks.push(...arr('reports').filter(r=>['OPEN','INVESTIGATING'].includes(r.status)).map(r=>['⚑','Báo cáo cần xử lý',r.title,'reports',r.id]));
    tasks.push(...arr('jobs').filter(r=>r.status==='PAUSED').map(r=>['▣','Tin tuyển dụng đang tạm dừng',r.title,'jobs',r.id]));
    opportunities=arr('users').slice(-3).reverse();
   }
   const actionRows=tasks.slice(0,5).map(t=>renderTask(...t)).join('')||`<div class="tm-soft-empty"><strong>Chưa có việc cần xử lý ngay</strong><p>Khi có bản ghi phù hợp, việc cần làm sẽ xuất hiện ở đây.</p></div>`;
   const opportunityHtml=opportunities.map(item=>`<article class="tm-opportunity"><div><strong>${esc(item.title||item.name||item.email||'Hồ sơ')}</strong><small>${esc(item.skill||item.skills||item.role||'Chưa cập nhật kỹ năng')}</small><p>${esc(item.location||item.email||'')} ${item.amount!=null?' · '+money(item.amount):''}</p></div>${actionLink(role==='ADMIN'?'users':role==='CLIENT'?'freelancers':'jobs','Xem',item.id)}</article>`).join('')||'<div class="tm-soft-empty">Chưa có gợi ý dựa trên dữ liệu hiện tại.</div>';
   const projectHtml=role==='ADMIN'?`<div class="tm-activity-list">${[...arr('reports'),...arr('jobs'),...projects].slice(-4).reverse().map(r=>`<article class="tm-activity"><span class="tm-task-dot">•</span><div><strong>${esc(r.title)}</strong><small>${esc(r.status||'Đang cập nhật')}</small></div></article>`).join('')||'<p>Chưa có hoạt động.</p>'}</div>`:projects.filter(r=>['IN_PROGRESS','REVIEW'].includes(r.status)).slice(0,3).map(r=>`<article class="tm-project-row"><div><strong>${esc(r.title)}</strong><small>${esc(r.status)} · ${milestones.filter(m=>Number(m.projectId)===Number(r.id)&&m.status!=='ACCEPTED').length} milestone chưa nghiệm thu</small></div>${actionLink('projects','Mở dự án',r.id)}</article>`).join('')||'<div class="tm-soft-empty">Bạn chưa có dự án đang thực hiện.</div>';
   if(failed.length){const metricResources=role==='ADMIN'?['users','users','users','reports']:role==='CLIENT'?['jobs','applications','invitations','projects']:['jobs','applications','invitations','projects'];metrics=metrics.map((metric,i)=>failed.includes(metricResources[i])?[metric[0],'—','Chưa tải được dữ liệu']:metric);}
   const suggestionsTitle=role==='ADMIN'?'Tài khoản mới trong dữ liệu':role==='CLIENT'?'Freelancer để khám phá':'Cơ hội công việc phù hợp';
   const primary=role==='ADMIN'?'reports':role==='CLIENT'?'jobs':'applications';
   displayMarkup(`<section class="tm-hero"><div><div class="tm-hero-overline">TALENTMATCH · ${esc(roleLabels[role].toUpperCase())}</div><h2>Xin chào, ${esc(username)} <span aria-hidden="true">✦</span></h2><p>${role==='ADMIN'?'Theo dõi nền tảng và ưu tiên các vấn đề cần xử lý.':role==='CLIENT'?'Kết nối đúng nhân tài và theo dõi tiến độ tuyển dụng.':'Khám phá cơ hội và quản lý công việc từ một nơi.'}</p>${role!=='ADMIN'?`<form id="dashboardSearch" class="tm-hero-search" action="${searchTarget}"><label class="tm-sr-only" for="dashboardQuery">Tìm kiếm</label><span aria-hidden="true">⌕</span><input id="dashboardQuery" name="q" type="search" placeholder="${searchHint}" autocomplete="off"><button type="submit">Tìm kiếm →</button></form>`:`<div class="tm-hero-links">${actionLink('users','Tài khoản')}${actionLink('reports','Xử lý báo cáo')}${actionLink('categories','Danh mục & kỹ năng')}</div>`}</div><div class="tm-hero-decoration" aria-hidden="true"><span>✦</span><span>◈</span><span>✧</span></div></section>${failed.length?`<div class="tm-inline-warning" role="status">Chưa tải được: ${esc(failed.join(', '))}. Số liệu tương ứng không đầy đủ; vui lòng kiểm tra API/database.</div>`:''}<section class="tm-stats" aria-label="Chỉ số tổng quan">${metrics.map(m=>stat(...m)).join('')}</section><div class="tm-dashboard-grid"><section class="tm-panel tm-priority-panel"><div class="tm-panel-head"><div><span class="tm-eyebrow">ƯU TIÊN</span><h2>Việc cần xử lý</h2></div>${actionLink(primary,'Xem chi tiết')}</div><div class="tm-tasks">${actionRows}</div></section><section class="tm-panel"><div class="tm-panel-head"><div><span class="tm-eyebrow">KHÁM PHÁ</span><h2>${suggestionsTitle}</h2></div><a href="${role==='CLIENT'?'candidates.html':role==='FREELANCER'?'jobs.html':'#'}" ${role==='ADMIN'?'data-go="users"':''}>Xem thêm →</a></div><div class="tm-opportunities">${opportunityHtml}</div></section></div><section class="tm-panel tm-projects-panel"><div class="tm-panel-head"><div><span class="tm-eyebrow">THEO DÕI</span><h2>${summaryTitle}</h2></div>${actionLink(role==='ADMIN'?'reports':'projects','Xem tất cả')}</div><div class="tm-project-list">${projectHtml}</div></section>`);
   $('mainContent').querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();navigateTo(el.dataset.go,el.dataset.item||null);}));return;
  }
  if(view==='profile'||view==='company'){
   const k=view==='profile'?'profile_freelancer':'profile_client';let d={};if(mode==='demo'){try{d=JSON.parse(localStorage.getItem('tm_'+k)||'{}')||{}}catch{}}else d=(await api('profile')).profile||{};
   displayMarkup(`<section class="tm-panel tm-profile-panel"><div class="tm-panel-head"><div><span class="tm-eyebrow">HỒ SƠ & TÀI KHOẢN</span><h2>${view==='profile'?'Hồ sơ Freelancer, CV và portfolio':'Hồ sơ doanh nghiệp'}</h2></div></div><p>Thông tin này được lưu ${mode==='demo'?'trong trình duyệt (demo)':'qua API hồ sơ của tài khoản'}; chưa hỗ trợ upload file CV an toàn.</p><form id="profileEdit" class="tm-profile-form"><div class="tm-field"><label for="profileName">Họ tên / tên doanh nghiệp</label><input id="profileName" name="name" required maxlength="120" value="${esc(d.name||user?.name||'')}"></div><div class="tm-field"><label for="profileHeadline">Tiêu đề / lĩnh vực</label><input id="profileHeadline" name="headline" maxlength="150" value="${esc(d.headline||'')}"></div><div class="tm-field"><label for="profileSkills">Kỹ năng / lĩnh vực chuyên môn</label><input id="profileSkills" name="skills" maxlength="300" value="${esc(d.skills||'')}"></div><div class="tm-field"><label for="profileBio">Giới thiệu</label><textarea id="profileBio" name="bio" rows="5" maxlength="3000">${esc(d.bio||'')}</textarea></div><div class="tm-field"><label for="profilePortfolio">Đường dẫn CV / portfolio (URL)</label><input id="profilePortfolio" name="portfolio" type="url" value="${esc(d.portfolio||'')}"></div><button class="tm-primary" style="margin-top:20px">Lưu hồ sơ</button></form></section>`);
   $('profileEdit').addEventListener('submit',async e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));try{if(mode==='demo')localStorage.setItem('tm_'+k,JSON.stringify(data));else await api('profile',{method:'POST',body:new URLSearchParams(data)});toast('Đã lưu hồ sơ '+(mode==='demo'?'trong trình duyệt (demo).':'trên máy chủ.'));}catch(err){toast(err.message,true)}});return;
  }
 }
 function renderRecords(){
  const fields=cfg[view]||{label:view};let filtered=records.filter(r=>(!(view==='milestones'&&projectFocus)||Number(r.projectId)===projectFocus)&&`${r.title||r.name||''} ${r.content||''} ${r.skill||''} ${r.email||''}`.toLowerCase().includes(search.toLowerCase())&&(filter==='all'||r.status===filter));
  let options=[...new Set(records.map(r=>r.status).filter(Boolean))];
  const pageSize=8,maxPage=Math.max(1,Math.ceil(filtered.length/pageSize));pageNumber=Math.min(pageNumber,maxPage);const visible=filtered.slice((pageNumber-1)*pageSize,pageNumber*pageSize);
  displayMarkup(`${view==='milestones'&&projectFocus?`<div class="tm-inline-warning">Milestone thuộc dự án #${esc(projectFocus)} <button id="clearProjectFocus" type="button" class="tm-textbutton">Xóa bộ lọc</button></div>`:''}<div class="tm-toolbar"><input id="recordSearch" type="search" aria-label="Tìm trong danh sách" placeholder="Tìm theo tên, từ khóa, nội dung…" value="${esc(search)}"><select id="recordStatus" aria-label="Lọc theo trạng thái"><option value="all">Tất cả trạng thái</option>${options.map(x=>`<option value="${esc(x)}" ${filter===x?'selected':''}>${esc(x)}</option>`).join('')}</select></div><p class="tm-small">Hiển thị ${filtered.length} / ${records.length} ${esc(fields.label||'mục')}. ${mode==='demo'?'Dữ liệu mẫu.':'Dữ liệu từ MySQL.'}</p><div class="tm-cards">${visible.map(recordCard).join('')}</div>${!filtered.length?'<div class="tm-empty"><h2>Không có kết quả phù hợp</h2><p>Thay đổi từ khóa hoặc bộ lọc để thử lại.</p></div>':''}<div class="tm-pagination"><button id="prevPage" class="tm-ghost" ${pageNumber<=1?'disabled':''}>← Trước</button><span>Trang ${pageNumber} / ${maxPage}</span><button id="nextPage" class="tm-ghost" ${pageNumber>=maxPage?'disabled':''}>Sau →</button></div>`);
  if($('clearProjectFocus'))$('clearProjectFocus').onclick=()=>{projectFocus=null;renderRecords();};
  if(focusId){const focus=$('tm-record-'+focusId);if(focus){focus.classList.add('tm-card-focus');focus.scrollIntoView({block:'nearest'});}}
  $('recordSearch').addEventListener('input',e=>{search=e.target.value;pageNumber=1;renderRecords();$('recordSearch').focus();$('recordSearch').setSelectionRange(search.length,search.length);});
  $('recordStatus').addEventListener('change',e=>{filter=e.target.value;pageNumber=1;renderRecords()});
  $('prevPage').onclick=()=>{if(pageNumber>1){pageNumber--;renderRecords()}};$('nextPage').onclick=()=>{if(pageNumber<maxPage){pageNumber++;renderRecords()}};
  $('mainContent').querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>act(button.dataset.action,Number(button.dataset.id))));
 }
 function recordCard(r){const name=r.title||r.name||r.email||`Mục #${r.id}`;const status=r.status||r.role||'';
  const extra=[r.amount!=null?money(r.amount):'',r.skill,r.location,r.target,r.dueDate,r.role,view==='agreements'?(r.clientApproved?'Client đã xác nhận':'Client chưa xác nhận')+' · '+(r.freelancerApproved?'Freelancer đã xác nhận':'Freelancer chưa xác nhận'):null].filter(Boolean).map(x=>`<span class="tm-small">${esc(x)}</span>`).join(' · ');
  const actions=[];
  if(view==='jobs'&&role==='FREELANCER')actions.push(['apply','Gửi proposal']);
  if(view==='freelancers'&&role==='CLIENT')actions.push(['invite','Gửi lời mời']);
  if(view==='invitations'&&role==='FREELANCER'&&r.status==='PENDING')actions.push(['ACCEPTED','Chấp nhận'],['REJECTED','Từ chối']);
  if(view==='invitations'&&role==='CLIENT'&&r.status==='PENDING')actions.push(['CANCELLED','Thu hồi lời mời']);
  if(view==='jobs'&&role==='CLIENT'&&r.status==='OPEN')actions.push(['PAUSED','Tạm dừng'],['CLOSED','Đóng tin']);
  if(view==='jobs'&&role==='CLIENT'&&r.status==='PAUSED')actions.push(['OPEN','Đăng lại'],['CLOSED','Đóng tin']);
  if(view==='applications'&&role==='CLIENT'&&['PENDING','SHORTLISTED'].includes(r.status)){if(r.status==='PENDING')actions.push(['SHORTLISTED','Vào danh sách chọn']);actions.push(['ACCEPTED','Chọn Freelancer'],['REJECTED','Từ chối']);}
  if(view==='milestones'&&role==='FREELANCER'&&['IN_PROGRESS','REVISION'].includes(r.status))actions.push(['SUBMITTED',r.status==='REVISION'?'Gửi lại sản phẩm':'Bàn giao']);
  if(view==='milestones'&&role==='CLIENT'&&r.status==='TODO')actions.push(['IN_PROGRESS','Bắt đầu milestone']);
  if(view==='milestones'&&role==='CLIENT'&&r.status==='SUBMITTED')actions.push(['ACCEPTED','Nghiệm thu'],['REVISION','Yêu cầu sửa']);
  if(view==='agreements'&&r.status==='DRAFT'){if(role==='CLIENT'&&!r.clientApproved||role==='FREELANCER'&&!r.freelancerApproved)actions.push(['SIGNED','Tôi xác nhận thỏa thuận']);}
  if(view==='projects'&&r.status==='IN_PROGRESS'&&role==='FREELANCER')actions.push(['REVIEW','Gửi yêu cầu nghiệm thu']);
  if(view==='projects'&&role==='CLIENT'&&r.status==='REVIEW')actions.push(['COMPLETED','Xác nhận hoàn tất']);
  if(view==='projects'&&role!=='ADMIN')actions.push(['projectMilestones','Xem milestone']);
  if(view==='notifications'&&r.status==='UNREAD')actions.push(['READ','Đã đọc']);
  if(view==='reports'&&role==='ADMIN'&&r.status==='OPEN')actions.push(['INVESTIGATING','Tiếp nhận']);
  if(view==='reports'&&role==='ADMIN'&&r.status==='INVESTIGATING')actions.push(['RESOLVED','Giải quyết']);
  if(role==='ADMIN'){if(view==='payments'&&r.status==='PENDING')actions.push(['RECORDED','Đối soát (demo)']);if(view==='credits'&&r.status==='PENDING')actions.push(['APPROVED','Duyệt điểm demo']);if(view==='premium'&&r.status==='REQUESTED')actions.push(['ACTIVE','Duyệt yêu cầu demo']);if(view==='categories')actions.push([r.status==='ACTIVE'?'HIDDEN':'ACTIVE','Đổi hiển thị']);if(view==='policies')actions.push([r.status==='DRAFT'?'PUBLISHED':'DRAFT','Đổi công bố']);if(view==='reviews')actions.push([r.status==='PUBLISHED'?'HIDDEN':'PUBLISHED','Kiểm duyệt đánh giá']);}
  if(view==='users'&&role==='ADMIN'&&r.role!=='ADMIN')actions.push([r.status==='SUSPENDED'?'ACTIVE':'SUSPENDED',r.status==='SUSPENDED'?'Kích hoạt':'Tạm khóa']);
  if(view==='premium'&&role!=='ADMIN'&&r.status==='AVAILABLE')actions.push(['premiumRequest','Yêu cầu nâng cấp']);
  const owns=mode==='demo'?r.ownerId===(role==='CLIENT'?2:role==='FREELANCER'?7:1):r.ownerId===user?.id;
  if((role==='ADMIN'||owns)&&['jobs','projects','milestones','agreements','applications','messages','reports','categories','policies','reviews'].includes(view)&&!(role==='ADMIN'&&['projects','milestones','agreements','messages'].includes(view)))actions.push(['edit','Chỉnh sửa']);
  return `<article class="tm-listcard" id="tm-record-${esc(r.id)}"><div class="tm-cardtop"><div><h3>${esc(name)}</h3><p>Mã #${esc(r.id)} ${r.createdAt?'· '+esc(String(r.createdAt).slice(0,10)):''}</p></div><span class="tm-status">${esc(status)}</span></div><div class="tm-record-body">${esc(r.content||r.bio||r.skills||'Chưa có mô tả.')}</div><div>${extra}</div><div class="tm-card-actions">${actions.map(([action,label])=>`<button type="button" data-id="${esc(r.id)}" data-action="${esc(action)}">${esc(label)}</button>`).join('')}</div></article>`;
 }
 async function act(action,id){let item=records.find(r=>Number(r.id)===id);if(!item)return;
  if(action==='edit'){openDialog(item);return;}
  if(action==='projectMilestones'){projectFocus=id;navigateTo('milestones');return;}
  if(action==='premiumRequest'){if(!confirm('Gửi yêu cầu quan tâm gói Premium? Không thực hiện thanh toán.'))return;try{const form={title:'Yêu cầu '+item.title,content:'Đăng ký quan tâm gói Premium, chưa thanh toán.',amount:String(item.amount),target:''};if(mode==='demo'){const data=store.premium||(store.premium=[]);data.unshift({id:Math.max(...data.map(x=>Number(x.id)))+1,...form,status:'REQUESTED',ownerId:role==='CLIENT'?2:7});persist();}else await api('data/premium',{method:'POST',body:new URLSearchParams(form)});await openView(view);toast('Đã ghi nhận yêu cầu quan tâm. Chưa có thanh toán thực tế.');}catch(err){toast(err.message,true)}return;}
  if(action==='apply'){view='applications';const u=new URL(location.href);u.searchParams.set('view','applications');u.searchParams.set('job',String(id));history.replaceState({},'',u.pathname+u.search);navigation();openDialog(null,{jobId:id,title:'Proposal cho '+item.title});return;}
  if(action==='invite'){view='invitations';navigation();openDialog(null,{target:item.email||item.title||item.name,title:'Lời mời hợp tác'});return;}
  if(!confirm(`Xác nhận thay đổi trạng thái thành "${action}"?`))return;
  try{if(mode==='demo'){let entry=(store[view]||[]).find(r=>Number(r.id)===id);if(entry){if(view==='agreements'&&action==='SIGNED'){if(role==='CLIENT')entry.clientApproved=true;if(role==='FREELANCER')entry.freelancerApproved=true;entry.status=entry.clientApproved&&entry.freelancerApproved?'SIGNED':'DRAFT';}else entry.status=action;persist();}}else await api('data/'+view+'/'+id,{method:'POST',body:new URLSearchParams({status:action})});toast(mode==='demo'?'Đã cập nhật trạng thái demo.':'Đã cập nhật trên máy chủ.');await openView(view);}catch(e){toast(e.message,true)}
 }
 function openDialog(item=null,prefill={}){
  const selected=cfg[view];if(!selected?.fields?.length){toast('Chức năng này không cho phép tạo dữ liệu từ giao diện.',true);return;}
  editing=item;$('dialogTitle').textContent=item?'Chỉnh sửa '+selected.label:'Tạo '+selected.label;
  let fields=selected.fields.map(field=>{let value=item?.[field]??prefill[field]??(field==='jobId'?qs.get('job'):'')??'';let input=field==='content'?`<textarea id="field_${field}" name="${field}" rows="4" maxlength="3000" required>${esc(value)}</textarea>`:`<input id="field_${field}" name="${field}" ${['amount','rating'].includes(field)?'type="number" min="0"':'type="text"'} ${field==='dueDate'?'placeholder="YYYY-MM-DD"':''} maxlength="300" value="${esc(value)}" ${['title','content'].includes(field)?'required':''}>`;return `<div class="tm-field"><label for="field_${field}">${esc(fieldLabels[field]||field)}</label>${input}</div>`;}).join('');$('formFields').innerHTML=fields;
  $('editDialog').showModal();
 }
 function closeDialog(){$('editDialog').close();editing=null;}
 async function submitForm(event){event.preventDefault();const values=Object.fromEntries(new FormData(event.currentTarget));if(!values.title?.trim()||!values.content?.trim()){toast('Nhập tiêu đề và mô tả',true);return;}if(values.rating&&(Number(values.rating)<1||Number(values.rating)>5)){toast('Số sao phải từ 1 đến 5.',true);return;}
  try{if(mode==='demo'){const coll=store[view]||(store[view]=[]);if(editing){Object.assign(coll.find(r=>r.id===editing.id),values)}else{const newId=Math.max(0,...coll.map(x=>Number(x.id)||0))+1;coll.unshift({id:newId,...values,ownerId:role==='ADMIN'?1:role==='CLIENT'?2:7,status:cfg[view].states[0],createdAt:new Date().toISOString()})}persist();}else{await api('data/'+view+(editing?'/'+editing.id:''),{method:'POST',body:new URLSearchParams(values)});}closeDialog();await openView(view);toast(mode==='demo'?'Đã lưu thay đổi demo vào trình duyệt.':'Đã lưu vào MySQL.');}catch(err){toast(err.message,true)}
 }
 // When the visitor follows a public job detail / Freelancer invitation link, display the draft form.
 setup().then(()=>{const job=qs.get('job'),candidate=qs.get('candidate');if(job&&view==='applications'){openDialog(null,{jobId:job,title:'Đề xuất cho công việc '+job});}else if(candidate&&view==='invitations'){openDialog(null,{target:candidate,title:'Lời mời làm việc'});}}).catch(err=>toast(err.message,true));
})();
