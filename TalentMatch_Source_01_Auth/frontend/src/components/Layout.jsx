import React,{useState} from 'react';
import {Link,NavLink,Outlet,useNavigate} from 'react-router-dom';
import {ArrowUpRight,BriefcaseBusiness,ChevronDown,Globe2,Menu,Moon,Sun,X} from 'lucide-react';
import {useApp,tr} from '../context/AppContext';
function Header(){
  const {user,lang,setLang,theme,setTheme,logout}=useApp(),[open,setOpen]=useState(false),navigate=useNavigate();
  const t=(vi,en)=>tr(lang,vi,en);
  async function signout(){await logout();setOpen(false);navigate('/')}
  return <header className="site-header"><div className="container nav-wrap">
    <Link className="brand" to="/" onClick={()=>setOpen(false)}><span className="brand-mark"><BriefcaseBusiness size={19}/></span><span>talent<span className="brand-em">match.</span></span></Link>
    <nav className={'nav-links '+(open?'nav-open':'')} aria-label="Main navigation">
      <NavLink to="/freelancers" onClick={()=>setOpen(false)}>{t('Tìm freelancer','Find talent')}</NavLink><NavLink to="/jobs" onClick={()=>setOpen(false)}>{t('Tìm dự án','Find projects')}</NavLink>
      {user&&<NavLink to="/dashboard" onClick={()=>setOpen(false)}>{t('Không gian làm việc','Dashboard')}</NavLink>}
      {user?.role==='CLIENT'&&<NavLink to="/jobs/new" onClick={()=>setOpen(false)}>{t('Đăng dự án','Post a project')}</NavLink>}
      {user?.role==='ADMIN'&&<NavLink to="/admin" onClick={()=>setOpen(false)}>{t('Quản trị','Admin')}</NavLink>}
    </nav>
    <div className="nav-actions"><button className="icon-btn" aria-label="Switch language" title="VI / EN" onClick={()=>setLang(lang==='vi'?'en':'vi')}><Globe2 size={18}/><span className="mini-label">{lang.toUpperCase()}</span></button><button className="icon-btn" aria-label="Toggle theme" onClick={()=>setTheme(theme==='light'?'dark':'light')}>{theme==='light'?<Moon size={18}/>:<Sun size={18}/>}</button>
      {user?<div className="account-actions"><Link to="/profile" className="avatar-mini">{user.avatarUrl?<img src={user.avatarUrl} alt=""/>:<span>{user.fullName.slice(0,1)}</span>}</Link><button className="text-btn signout" onClick={signout}>{t('Thoát','Log out')}</button></div>:<><Link className="text-btn" to="/login">{t('Đăng nhập','Log in')}</Link><Link className="btn btn-dark btn-small" to="/register">{t('Bắt đầu','Get started')} <ArrowUpRight size={15}/></Link></>}
      <button aria-label="Toggle menu" className="menu-btn" onClick={()=>setOpen(!open)}>{open?<X size={22}/>:<Menu size={22}/>}</button>
    </div>
  </div></header>;
}
export function Layout(){const {lang}=useApp();return <><Header/><main id="main-content"><Outlet/></main><footer className="site-footer"><div className="container footer-content"><div><Link className="brand" to="/"><span className="brand-mark"><BriefcaseBusiness size={19}/></span><span>talent<span className="brand-em">match.</span></span></Link><p>{tr(lang,'Kết nối đúng người. Tạo nên điều lớn lao.','Meaningful work starts with the right people.')}</p></div><div className="footer-right"><Link to="/freelancers">Freelancers</Link><Link to="/jobs">Projects</Link><Link to="/about">{tr(lang,'Giới thiệu','About')}</Link></div></div><div className="container copyright">© 2026 TalentMatch · Bản demo phục vụ học tập, không xử lý thanh toán thật.</div></footer></>}
export function PageHeader({eyebrow,title,description,children}){return <section className="page-heading container"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description&&<p className="muted big-p">{description}</p>}</div>{children&&<div>{children}</div>}</section>}
export function Empty({title='Chưa có dữ liệu',description='Hãy thử lại hoặc điều chỉnh tìm kiếm.'}){return <div className="empty-state"><BriefcaseBusiness size={26}/><h3>{title}</h3><p>{description}</p></div>}
export function Alert({error,success}){return error?<p role="alert" className="alert error">{error}</p>:success?<p className="alert success">{success}</p>:null}
export function Avatar({user,size='normal'}){return <div className={'avatar '+size}>{user?.avatarUrl?<img src={user.avatarUrl} alt={user.fullName||'Avatar'}/>:<span>{(user?.fullName||'T').slice(0,1).toUpperCase()}</span>}</div>}
