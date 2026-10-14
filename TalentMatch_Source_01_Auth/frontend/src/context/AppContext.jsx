import React,{createContext,useContext,useEffect,useMemo,useState} from 'react';
import {api} from '../lib/api';
const Context=createContext(null);
export function AppProvider({children}){
  const [user,setUser]=useState(null),[loading,setLoading]=useState(true);
  const [theme,setTheme]=useState(localStorage.getItem('tm_theme')||'light');
  const [lang,setLang]=useState(localStorage.getItem('tm_lang')||'vi');
  useEffect(()=>{api('/auth/me').then(r=>setUser(r.user)).catch(()=>setUser(null)).finally(()=>setLoading(false));},[]);
  useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('tm_theme',theme)},[theme]);
  useEffect(()=>{document.documentElement.lang=lang;localStorage.setItem('tm_lang',lang)},[lang]);
  const login=async(email,password)=>{const r=await api('/auth/login',{method:'POST',body:{email,password}});setUser(r.user);return r.user;};
  const register=async(values)=>api('/auth/register',{method:'POST',body:values});
  const logout=async()=>{await api('/auth/logout',{method:'POST'});setUser(null)};
  const refresh=async()=>{const r=await api('/auth/me');setUser(r.user)};
  const value=useMemo(()=>({user,loading,theme,setTheme,lang,setLang,login,register,logout,refresh}),[user,loading,theme,lang]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useApp=()=>useContext(Context);
export const tr=(lang,vi,en)=>lang==='en'?en:vi;
