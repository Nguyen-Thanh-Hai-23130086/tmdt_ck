package controller;
import java.lang.reflect.*;
import java.io.*;
import java.util.*;
import jakarta.servlet.http.*;
import util.RateLimiter;
public class ApiSmokeTest {
 private static int count=0;
 private static void check(String name,boolean pass){count++;if(!pass)throw new AssertionError(name);System.out.println("PASS " + name);}
 static class Mock {
  final Map<String,String> headers=new HashMap<>(),params=new HashMap<>();
  String info,servletPath="/api/auth", ip="127.0.0.1";
  int status=-1;StringWriter text=new StringWriter();PrintWriter writer=new PrintWriter(text);
  final HttpServletRequest req=(HttpServletRequest)Proxy.newProxyInstance(HttpServletRequest.class.getClassLoader(),new Class[]{HttpServletRequest.class},(proxy,method,args)->switch(method.getName()){
   case "getHeader"->headers.get((String)args[0]);case "getParameter"->params.get((String)args[0]);case "getPathInfo"->info;case "getServletPath"->servletPath;case "getRemoteAddr"->ip;case "getSession"->null;case "setCharacterEncoding"->null;default->null;});
  final HttpServletResponse res=(HttpServletResponse)Proxy.newProxyInstance(HttpServletResponse.class.getClassLoader(),new Class[]{HttpServletResponse.class},(proxy,method,args)->{
   if(method.getName().equals("setStatus")){status=(int)args[0];return null;}
   if(method.getName().equals("getWriter"))return writer;
   return null;
  });
 }
 public static void main(String[]args)throws Exception {
  LoginController auth=new LoginController(); DataController data=new DataController();
  Mock noHeader=new Mock();noHeader.info="/login";auth.doPost(noHeader.req,noHeader.res);check("CSRF custom header required",noHeader.status==403);
  Mock noSession=new Mock();noSession.info="/me";auth.doGet(noSession.req,noSession.res);check("me requires session",noSession.status==401);
  Mock invalid=new Mock();invalid.info="/register";invalid.ip="10.1.2.3";invalid.headers.put("X-TM-Request","1");invalid.params.put("name","A");invalid.params.put("email","invalid");invalid.params.put("password","Demo@2026Safe!");invalid.params.put("role","FREELANCER");auth.doPost(invalid.req,invalid.res);check("registration validates email",invalid.status==400);
  Mock privilege=new Mock();privilege.info="/register";privilege.ip="10.1.2.4";privilege.headers.put("X-TM-Request","1");privilege.params.put("name","Admin attempt");privilege.params.put("email","admin@example.com");privilege.params.put("password","Demo@2026Safe!");privilege.params.put("role","ADMIN");auth.doPost(privilege.req,privilege.res);check("public registration forbids admin role",privilege.status==400);
  Mock noProfile=new Mock();noProfile.servletPath="/api/profile";data.doGet(noProfile.req,noProfile.res);check("profile requires authentication",noProfile.status==401);
  Mock noWrite=new Mock();noWrite.servletPath="/api/data";noWrite.info="/jobs";noWrite.headers.put("X-TM-Request","1");data.doPost(noWrite.req,noWrite.res);check("record creation requires session",noWrite.status==401);
  String key="test-limiter";check("rate limiter allows first request",RateLimiter.allow(key,2,30000));RateLimiter.failure(key,30000);check("rate limiter counts failures",RateLimiter.allow(key,2,30000));RateLimiter.failure(key,30000);check("rate limiter rejects excess",!RateLimiter.allow(key,2,30000));RateLimiter.success(key);check("limiter cleared after success",RateLimiter.allow(key,2,30000));
  System.out.println("API security smoke passed: "+count);
 }
}
