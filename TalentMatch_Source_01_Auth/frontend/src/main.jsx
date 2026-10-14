import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import {AppProvider} from './context/AppContext';
import {Layout} from './components/Layout';
import {Protected} from './components/Protected';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Auth from './pages/Auth';
import {FreelancerDetail,JobDetail} from './pages/Details';
import Dashboard,{NewJob,Applicants} from './pages/Dashboard';
import ProfileEdit from './pages/ProfileEdit';
import Workspace from './pages/Workspace';
import Admin from './pages/Admin';
import {VerifyEmail,CheckEmail,ForgotPassword,ResetPassword} from './pages/AccountAccess';
import './styles/main.css';
function About(){return <div className="container narrow-page"><section className="page-heading"><div className="eyebrow">ABOUT TALENTMATCH</div><h1>Ý tưởng, con người và sự hợp tác.</h1><p className="big-p muted">TalentMatch là dự án học tập xây dựng nền tảng kết nối Client và Freelancer. Website cung cấp quy trình từ tìm kiếm, đăng dự án, ứng tuyển, làm việc, nghiệm thu đến đánh giá. Tất cả giao dịch thanh toán đều là mô phỏng.</p><p>Người dùng cần tự chịu trách nhiệm về nội dung họ đăng tải. Sản phẩm demo không cam kết xác minh danh tính, bảo đảm thanh toán hay hỗ trợ ký quỹ thực tế.</p></section></div>}
function NotFound(){return <div className="container section"><h1>404 — Không tìm thấy trang</h1><p>Đường dẫn không tồn tại.</p></div>}
const secure=(roles,element)=><Protected roles={roles}>{element}</Protected>;
function App(){return <AppProvider><BrowserRouter><Routes><Route element={<Layout/>}><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/freelancers" element={<Browse kind="freelancers"/>}/><Route path="/freelancers/:id" element={<FreelancerDetail/>}/><Route path="/jobs" element={<Browse kind="jobs"/>}/><Route path="/jobs/:id" element={<JobDetail/>}/><Route path="/login" element={<Auth type="login"/>}/><Route path="/register" element={<Auth type="register"/>}/><Route path="/verify-email" element={<VerifyEmail/>}/><Route path="/check-email" element={<CheckEmail/>}/><Route path="/forgot-password" element={<ForgotPassword/>}/><Route path="/reset-password" element={<ResetPassword/>}/><Route path="/dashboard" element={secure(null,<Dashboard/>)}/><Route path="/profile" element={secure(null,<ProfileEdit/>)}/><Route path="/jobs/new" element={secure(['CLIENT'],<NewJob/>)}/><Route path="/jobs/:id/edit" element={secure(['CLIENT'],<NewJob/>)}/><Route path="/jobs/:id/applications" element={secure(['CLIENT'],<Applicants/>)}/><Route path="/workspaces/:id" element={secure(null,<Workspace/>)}/><Route path="/admin" element={secure(['ADMIN'],<Admin/>)}/><Route path="*" element={<NotFound/>}/></Route></Routes></BrowserRouter></AppProvider>}
createRoot(document.getElementById('root')).render(<App/>);
