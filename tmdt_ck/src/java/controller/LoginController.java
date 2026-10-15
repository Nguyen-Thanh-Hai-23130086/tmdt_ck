package controller;
import jakarta.servlet.annotation.WebServlet;import jakarta.servlet.http.*;import java.io.*;import java.sql.*;import java.util.*;import service.LoginService;import model.User;import util.Http;import util.RateLimiter;
@WebServlet(urlPatterns={"/login","/api/auth/*"})
public class LoginController extends HttpServlet {
 private final LoginService service=new LoginService();
 @Override protected void doGet(HttpServletRequest req,HttpServletResponse resp)throws IOException{
  if(!"/me".equals(req.getPathInfo())){Http.write(resp,404,Http.error("Không tìm thấy endpoint"));return;}
  User user=Http.loggedIn(req);Http.write(resp,user==null?401:200,user==null?Http.error("Chưa đăng nhập"):Map.of("user",Http.publicUser(user)));
 }
 @Override protected void doPost(HttpServletRequest req,HttpServletResponse resp)throws IOException{
  if(!Http.mutationAllowed(req)){Http.write(resp,403,Http.error("Yêu cầu không hợp lệ"));return;}
  req.setCharacterEncoding("UTF-8");String path=req.getPathInfo();if(path==null)path="/login";
  String address=req.getRemoteAddr()==null?"unknown":req.getRemoteAddr();
  String key=address+":"+path;
  if((path.equals("/login")&&!RateLimiter.allow(key,10,15*60_000L))||(path.equals("/register")&&!RateLimiter.allow(key,5,60*60_000L))){resp.setHeader("Retry-After","900");Http.write(resp,429,Http.error("Quá nhiều yêu cầu. Vui lòng thử lại sau."));return;}
  try{
   if("/logout".equals(path)){HttpSession s=req.getSession(false);if(s!=null)s.invalidate();Http.write(resp,200,Map.of("ok",true));return;}
   if("/login".equals(path)){
    User user=service.login(req.getParameter("email"),req.getParameter("password"));
    if(user==null){RateLimiter.failure(key,15*60_000);Http.write(resp,401,Http.error("Email hoặc mật khẩu không chính xác"));return;}
    RateLimiter.success(key);
    HttpSession old=req.getSession(false);if(old!=null)old.invalidate();HttpSession session=req.getSession(true);session.setAttribute("user",user);session.setMaxInactiveInterval(30*60);req.changeSessionId();
    Http.write(resp,200,Map.of("user",Http.publicUser(user)));return;
   }
   if("/register".equals(path)){
    RateLimiter.failure(key,60*60_000);
    User user=service.register(req.getParameter("name"),req.getParameter("email"),req.getParameter("password"),req.getParameter("role"));Http.write(resp,201,Map.of("user",Http.publicUser(user)));return;
   }
   Http.write(resp,404,Http.error("Không tìm thấy endpoint"));
  }catch(IllegalArgumentException e){Http.write(resp,400,Http.error(e.getMessage()));}
   catch(SQLIntegrityConstraintViolationException e){Http.write(resp,409,Http.error("Email đã tồn tại"));}
   catch(SQLException e){getServletContext().log("Login database error",e);Http.write(resp,503,Http.error("Database chưa sẵn sàng"));}
 }
}