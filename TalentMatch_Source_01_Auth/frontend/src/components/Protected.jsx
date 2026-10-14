import React from 'react';
import {Navigate,useLocation} from 'react-router-dom';
import {useApp} from '../context/AppContext';
export function Protected({roles,children}){
  const {user,loading}=useApp(),location=useLocation();
  if(loading)return <div className="container loader">Đang kiểm tra phiên đăng nhập...</div>;
  if(!user)return <Navigate to="/login" state={{from:location.pathname}} replace/>;
  if(roles&&!roles.includes(user.role))return <div className="container section"><h2>Không có quyền truy cập</h2><p>Tài khoản không có quyền sử dụng tính năng này.</p></div>;
  return children;
}
