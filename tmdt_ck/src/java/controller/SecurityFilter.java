package controller;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.*;
import dao.UserDao;
import model.User;
import util.Http;
import java.io.IOException;
import java.sql.SQLException;
/** Server-side session revalidation: banning a user revokes their access on the next API call. */
@WebFilter(urlPatterns={"/api/*", "/login"})
public class SecurityFilter implements Filter {
 @Override public void doFilter(ServletRequest request,ServletResponse response,FilterChain chain)throws IOException,ServletException {
  HttpServletRequest req=(HttpServletRequest)request;HttpServletResponse resp=(HttpServletResponse)response;
  resp.setHeader("X-Content-Type-Options","nosniff");
  resp.setHeader("X-Frame-Options","DENY");
  resp.setHeader("Referrer-Policy","strict-origin-when-cross-origin");
  resp.setHeader("Content-Security-Policy","default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; frame-ancestors 'none'; base-uri 'self'");
  HttpSession session=req.getSession(false);
  if(session!=null&&session.getAttribute("user") instanceof User old){
   try{
    User current=new UserDao().findById(old.getId());
    if(current==null||!"ACTIVE".equals(current.getStatus())||!old.getRole().equals(current.getRole())){
     session.invalidate();
     if(!req.getServletPath().startsWith("/api/auth")){Http.write(resp,401,Http.error("Phiên đăng nhập đã hết hiệu lực"));return;}
    }else{current.setPassword(null);session.setAttribute("user",current);}
   }catch(SQLException e){Http.write(resp,503,Http.error("Không kiểm tra được trạng thái tài khoản"));return;}
  }
  chain.doFilter(request,response);
 }
}
