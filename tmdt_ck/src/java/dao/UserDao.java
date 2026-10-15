package dao;
import model.User;import java.sql.*;import java.util.*;
public class UserDao extends BaseDao {
 private User toUser(ResultSet rs)throws SQLException{User u=new User();u.setId(rs.getInt("id"));u.setFullName(rs.getString("full_name"));u.setEmail(rs.getString("email"));u.setPassword(rs.getString("password"));u.setRole(rs.getString("role"));u.setStatus(rs.getString("status"));u.setCreatedAt(rs.getTimestamp("created_at"));return u;}
 public boolean existsByEmail(String email)throws SQLException{return findByEmail(email)!=null;}
 public User findByEmail(String email)throws SQLException{try(Connection c=getConnection();PreparedStatement p=c.prepareStatement("SELECT * FROM users WHERE email=? LIMIT 1")){p.setString(1,email);try(ResultSet rs=p.executeQuery()){return rs.next()?toUser(rs):null;}}}
 public User findById(int id)throws SQLException{try(Connection c=getConnection();PreparedStatement p=c.prepareStatement("SELECT * FROM users WHERE id=? LIMIT 1")){p.setInt(1,id);try(ResultSet rs=p.executeQuery()){return rs.next()?toUser(rs):null;}}}
 public User create(String name,String email,String passwordHash,String role)throws SQLException{
  try(Connection c=getConnection();PreparedStatement p=c.prepareStatement("INSERT INTO users(full_name,email,password,role,status) VALUES(?,?,?,?, 'ACTIVE')",Statement.RETURN_GENERATED_KEYS)){
   p.setString(1,name);p.setString(2,email);p.setString(3,passwordHash);p.setString(4,role);p.executeUpdate();try(ResultSet keys=p.getGeneratedKeys()){if(!keys.next())throw new SQLException("No generated user ID");return findById(keys.getInt(1));}
  }
 }
 public List<Map<String,Object>> listUsers(boolean onlyFreelancers)throws SQLException{
  String sql="SELECT id,full_name,email,role,status,created_at FROM users"+(onlyFreelancers?" WHERE role='FREELANCER' AND status='ACTIVE'":"")+" ORDER BY id DESC LIMIT 300";
  List<Map<String,Object>> list=new ArrayList<>();try(Connection c=getConnection();PreparedStatement p=c.prepareStatement(sql);ResultSet rs=p.executeQuery()){while(rs.next()){Map<String,Object> m=new LinkedHashMap<>();m.put("id",rs.getInt("id"));m.put("title",rs.getString("full_name"));m.put("email",rs.getString("email"));m.put("role",rs.getString("role"));m.put("status",rs.getString("status"));m.put("content",rs.getString("role"));list.add(m);}}return list;
 }
 public List<Map<String,Object>> listFreelancers(boolean includeEmail)throws SQLException{
  List<Map<String,Object>> list=new ArrayList<>();
  String sql="SELECT u.id,u.full_name,u.email,u.role,u.status,p.headline,p.skills,p.bio,p.portfolio FROM users u LEFT JOIN profiles p ON u.id=p.user_id WHERE u.role='FREELANCER' AND u.status='ACTIVE' ORDER BY u.id DESC LIMIT 300";
  try(Connection c=getConnection();PreparedStatement p=c.prepareStatement(sql);ResultSet r=p.executeQuery()){while(r.next()){
    Map<String,Object> m=new LinkedHashMap<>();m.put("id",r.getInt("id"));m.put("title",r.getString("full_name"));m.put("content",r.getString("bio"));m.put("skill",r.getString("skills"));m.put("headline",r.getString("headline"));m.put("portfolio",r.getString("portfolio"));m.put("role","FREELANCER");m.put("status","ACTIVE");if(includeEmail)m.put("email",r.getString("email"));list.add(m);
  }}return list;
 }
 public void setStatus(int id,String status)throws SQLException{try(Connection c=getConnection();PreparedStatement p=c.prepareStatement("UPDATE users SET status=? WHERE id=? AND role<>'ADMIN'")){p.setString(1,status);p.setInt(2,id);if(p.executeUpdate()==0)throw new SQLException("Không được sửa tài khoản này");}}
 public Map<String,Object> getProfile(int id)throws SQLException{
  try(Connection c=getConnection();PreparedStatement p=c.prepareStatement("SELECT name,headline,skills,bio,portfolio FROM profiles WHERE user_id=?")){p.setInt(1,id);try(ResultSet rs=p.executeQuery()){if(rs.next()){Map<String,Object> m=new LinkedHashMap<>();for(String key:List.of("name","headline","skills","bio","portfolio"))m.put(key,rs.getString(key));return m;}}}return new LinkedHashMap<>();
 }
 public void saveProfile(int id,Map<String,String> data)throws SQLException{
  try(Connection c=getConnection();PreparedStatement p=c.prepareStatement("INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) VALUES(?,?,?,?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name),headline=VALUES(headline),skills=VALUES(skills),bio=VALUES(bio),portfolio=VALUES(portfolio)")){
   p.setInt(1,id);int n=2;for(String key:List.of("name","headline","skills","bio","portfolio"))p.setString(n++,data.getOrDefault(key,""));p.executeUpdate();
  }
 }
}