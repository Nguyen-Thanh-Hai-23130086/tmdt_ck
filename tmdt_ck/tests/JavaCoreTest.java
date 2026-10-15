import util.PasswordHash;
import util.Json;
import dao.UserDao;
import model.User;
import service.LoginService;
import java.sql.SQLException;
import java.util.Map;
public class JavaCoreTest {
 static int total=0;
 static void check(String name,boolean value){total++;if(!value)throw new AssertionError(name);System.out.println("PASS " + name);}
 static class FakeUserDao extends UserDao {
  User user;
  @Override public User findByEmail(String email)throws SQLException{return user!=null&&user.getEmail().equals(email)?user:null;}
 }
 public static void main(String[]args)throws Exception {
  String encoded=PasswordHash.hash("Demo@2026Safe!");check("hash format",encoded.startsWith("pbkdf2_sha256$160000$"));
  check("hash verifies",PasswordHash.verify("Demo@2026Safe!",encoded));
  check("wrong password rejected",!PasswordHash.verify("wrong-password",encoded));
  check("malformed hash rejected",!PasswordHash.verify("Demo@2026Safe!","unhashed-string"));
  check("different salts",!encoded.equals(PasswordHash.hash("Demo@2026Safe!")));
  FakeUserDao dao=new FakeUserDao();dao.user=new User();dao.user.setId(7);dao.user.setFullName("Nguyễn Minh");dao.user.setEmail("minh@example.test");dao.user.setRole("FREELANCER");dao.user.setStatus("ACTIVE");dao.user.setPassword(encoded);
  LoginService service=new LoginService(dao);
  User sessionUser=service.login("MINH@EXAMPLE.TEST","Demo@2026Safe!");
  check("login normalized email",sessionUser!=null);
  check("session does not carry hash",sessionUser.getPassword()==null);
  check("invalid credential",service.login("minh@example.test","wrong-password")==null);
  dao.user.setStatus("SUSPENDED");check("suspended user denied",service.login("minh@example.test","Demo@2026Safe!")==null);
  check("JSON Unicode escaped safely",Json.encode(Map.of("text","<script>\nĐúng","ok",true)).contains("\\n"));
  String seed=java.nio.file.Files.readString(java.nio.file.Path.of("database/seed_demo.sql"));
  java.util.regex.Matcher matcher=java.util.regex.Pattern.compile("pbkdf2_sha256\\$160000\\$[A-Za-z0-9+/=]+\\$[A-Za-z0-9+/=]+").matcher(seed);
  check("seed contains password hash",matcher.find());
  check("Python seed hash verifies in Java",PasswordHash.verify("Demo@2026Safe!",matcher.group()));
  System.out.println("Java core tests passed: " + total);
 }
}
