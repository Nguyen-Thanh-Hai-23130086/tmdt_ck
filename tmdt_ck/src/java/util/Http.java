package util;
import jakarta.servlet.http.*;import java.io.*;import java.util.*;
public final class Http {
 private Http(){}
 public static void write(HttpServletResponse response,int status,Object body)throws IOException{
  response.setStatus(status);response.setContentType("application/json;charset=UTF-8");response.setHeader("Cache-Control","no-store");response.setHeader("X-Content-Type-Options","nosniff");response.getWriter().write(Json.encode(body));
 }
 public static Map<String,Object> error(String s){return Map.of("error",s);}
 public static boolean mutationAllowed(HttpServletRequest req){String origin=req.getHeader("Origin");String host=req.getHeader("Host");if(origin!=null&&host!=null){try{java.net.URI uri=java.net.URI.create(origin);if(!host.equalsIgnoreCase(uri.getAuthority()))return false;}catch(Exception e){return false;}}return "1".equals(req.getHeader("X-TM-Request"));}
 public static Map<String,Object> publicUser(model.User u){return Map.of("id",u.getId(),"name",u.getFullName(),"email",u.getEmail(),"role",u.getRole());}
 public static model.User loggedIn(HttpServletRequest req){HttpSession session=req.getSession(false);return session==null?null:(model.User)session.getAttribute("user");}
}