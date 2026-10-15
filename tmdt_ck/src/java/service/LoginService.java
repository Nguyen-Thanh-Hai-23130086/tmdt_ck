package service;
import dao.UserDao;import model.User;import util.PasswordHash;import java.sql.SQLException;import java.util.Locale;
public class LoginService {
 private final UserDao userDao;
 public LoginService(){this(new UserDao());}
 public LoginService(UserDao dao){this.userDao=dao;}
 public User login(String email,String password)throws SQLException{
  if(email==null||password==null||email.isBlank()||password.isBlank())return null;
  User user=userDao.findByEmail(email.trim().toLowerCase(Locale.ROOT));
  if(user==null||!"ACTIVE".equals(user.getStatus())||!PasswordHash.verify(password,user.getPassword()))return null;
  user.setPassword(null);return user;
 }
 public User register(String name,String email,String password,String role)throws SQLException{
  if(name==null||name.isBlank()||name.length()>120||email==null||!email.matches("(?i)^[a-z0-9._%+-]+@[a-z0-9.-]+[.][a-z]{2,}$")||email.length()>180)throw new IllegalArgumentException("Thông tin đăng ký không hợp lệ");
  if(!"FREELANCER".equals(role)&&!"CLIENT".equals(role))throw new IllegalArgumentException("Vai trò không hợp lệ");
  if(password==null||password.length()<10||password.length()>128||!password.matches("(?s).*[a-z].*")||!password.matches("(?s).*[A-Z].*")||!password.matches("(?s).*\\d.*"))throw new IllegalArgumentException("Mật khẩu cần 10–128 ký tự, gồm chữ hoa, chữ thường và số");
  String normalized=email.trim().toLowerCase(Locale.ROOT);
  if(userDao.existsByEmail(normalized))throw new IllegalArgumentException("Email đã tồn tại");
  User user=userDao.create(name.trim(),normalized,PasswordHash.hash(password),role);user.setPassword(null);return user;
 }
}