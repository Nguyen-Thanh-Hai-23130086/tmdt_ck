package controller;
import jakarta.servlet.annotation.WebServlet;import jakarta.servlet.http.*;import java.io.*;import java.sql.*;import java.util.*;import model.*;import dao.*;import service.*;import util.Http;
@WebServlet(urlPatterns={"/api/data/*","/api/profile"})
public class DataController extends HttpServlet {
 private final WorkService service=new WorkService();private final UserDao users=new UserDao();
 private String[] parts(HttpServletRequest req){String path=req.getPathInfo();if(path==null)return new String[0];return Arrays.stream(path.split("/")).filter(s->!s.isBlank()).toArray(String[]::new);}
 private Map<String,String> parameters(HttpServletRequest req){Map<String,String> m=new HashMap<>();for(String key:List.of("title","content","amount","target","skill","location","jobId","projectId","dueDate","rating","status","name","headline","skills","bio","portfolio")){String v=req.getParameter(key);if(v!=null)m.put(key,v);}return m;}
 @Override protected void doGet(HttpServletRequest req,HttpServletResponse resp)throws IOException{
  try{User actor=Http.loggedIn(req);
   if(req.getServletPath().equals("/api/profile")){if(actor==null){Http.write(resp,401,Http.error("Yêu cầu đăng nhập"));return;}Http.write(resp,200,Map.of("profile",users.getProfile(actor.getId())));return;}
   String[] parts=parts(req);if(parts.length!=1){Http.write(resp,404,Http.error("Không tìm thấy endpoint"));return;}
   Http.write(resp,200,Map.of("items",service.list(parts[0],actor)));
  }catch(SecurityException e){Http.write(resp,403,Http.error(e.getMessage()));}
  catch(IllegalArgumentException e){Http.write(resp,400,Http.error(e.getMessage()));}
  catch(SQLException e){getServletContext().log("Data query error",e);Http.write(resp,503,Http.error("Database chưa sẵn sàng"));}
 }
 @Override protected void doPost(HttpServletRequest req,HttpServletResponse resp)throws IOException{
  if(!Http.mutationAllowed(req)){Http.write(resp,403,Http.error("Yêu cầu không hợp lệ"));return;}
  req.setCharacterEncoding("UTF-8");User actor=Http.loggedIn(req);if(actor==null){Http.write(resp,401,Http.error("Yêu cầu đăng nhập"));return;}
  try{Map<String,String> payload=parameters(req);
   if(req.getServletPath().equals("/api/profile")){for(String value:payload.values())if(value.length()>3000)throw new IllegalArgumentException("Dữ liệu quá dài");users.saveProfile(actor.getId(),payload);Http.write(resp,200,Map.of("ok",true));return;}
   String[] path=parts(req);if(path.length==1){WorkRecord r=service.create(path[0],actor,payload);Http.write(resp,201,Map.of("item",r.publicMap()));return;}
   if(path.length==2){int id=Integer.parseInt(path[1]);if(path[0].equals("users")){service.changeUserStatus(actor,id,payload.get("status"));Http.write(resp,200,Map.of("ok",true));return;}
    WorkRecord r=service.modify(path[0],id,actor,payload);Http.write(resp,200,Map.of("item",r.publicMap()));return;}
   Http.write(resp,404,Http.error("Không tìm thấy endpoint"));
  }catch(SecurityException e){Http.write(resp,403,Http.error(e.getMessage()));}
   catch(IllegalArgumentException e){Http.write(resp,400,Http.error(e.getMessage()));}
   catch(SQLException e){getServletContext().log("Data save error",e);Http.write(resp,503,Http.error("Không thể lưu dữ liệu"));}
 }
}