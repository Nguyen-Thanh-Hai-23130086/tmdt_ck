(function(){
 const avatar=document.getElementById('avatarButton'),menu=document.getElementById('avatarMenu');
 if(avatar){
  avatar.addEventListener('click',()=>{const open=menu?.classList.toggle('open');avatar.setAttribute('aria-expanded',String(!!open));});
  document.addEventListener('click',e=>{if(!e.target.closest('.avatar-area')){menu?.classList.remove('open');avatar.setAttribute('aria-expanded','false');}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu?.classList.remove('open');avatar.setAttribute('aria-expanded','false');}});
  fetch('../api/auth/me',{credentials:'same-origin'}).then(async response=>{
   if(response.ok){const body=await response.json();if(!body.user){guest();return;}const name=body.user.name||'Thành viên';const title=menu?.querySelector('strong');if(title)title.textContent=name;const label=menu?.querySelector('span:not(.avatar)');if(label)label.textContent=({ADMIN:'Quản trị',CLIENT:'Nhà tuyển dụng',FREELANCER:'Freelancer'})[body.user.role]||'Thành viên';avatar.textContent=name.trim().split(/\s+/).slice(-2).map(t=>t[0]).join('').toUpperCase();const link=menu?.querySelector('a[href*="workspace.html"]');if(link)link.href='workspace.html?view='+({ADMIN:'users',CLIENT:'company',FREELANCER:'profile'}[body.user.role]||'dashboard');}
   else guest();
  }).catch(guest);
  function guest(){if(menu)menu.remove();const link=document.createElement('a');link.href='login_register.html';link.className='tm-login-shortcut';link.textContent='Đăng nhập';avatar.replaceWith(link);}
 }
 document.querySelectorAll('[data-logout]').forEach(a=>a.addEventListener('click',async e=>{
  e.preventDefault();try{
   const response=await fetch('../api/auth/logout',{method:'POST',headers:{'X-TM-Request':'1'},credentials:'same-origin'});
   if(!response.ok&&response.status!==401)throw Error('Không thể đăng xuất');
   sessionStorage.removeItem('tm_user');location.href='login_register.html';
  }catch{const host=a.closest('.avatar-menu')||a.parentElement;let message=host.querySelector('.tm-menu-error');if(!message){message=document.createElement('p');message.className='tm-menu-error';message.setAttribute('role','alert');host.append(message);}message.textContent='Đăng xuất chưa thành công. Kiểm tra kết nối rồi thử lại.';}
 }));
 document.querySelectorAll('button.search').forEach(b=>b.addEventListener('click',()=>location.href='jobs.html'));
 document.querySelectorAll('.newsletter form').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const email=f.querySelector('input');if(email?.checkValidity()){alert('Đã ghi nhận trên giao diện demo. Chưa có dịch vụ gửi bản tin.');f.reset();}else email?.reportValidity();}));
})();