package dao;
import model.*;import java.sql.*;import java.util.*;
public class RecordDao extends BaseDao {
 private WorkRecord read(ResultSet r)throws SQLException{
  WorkRecord x=new WorkRecord();x.id=r.getInt("id");x.ownerId=r.getInt("owner_id");x.kind=r.getString("kind");x.title=r.getString("title");x.content=r.getString("content");x.status=r.getString("status");x.target=r.getString("target_email");x.skill=r.getString("skill");x.location=r.getString("location");x.dueDate=r.getString("due_date");x.amount=r.getLong("amount");x.jobId=r.getInt("job_id");x.projectId=r.getInt("project_id");x.rating=r.getInt("rating");x.clientApproved=r.getBoolean("client_approved");x.freelancerApproved=r.getBoolean("freelancer_approved");x.createdAt=String.valueOf(r.getTimestamp("created_at"));return x;
 }
 public List<WorkRecord> list(String kind,User user)throws SQLException{
  String sql="SELECT r.* FROM records r WHERE r.kind=?";
  // Authentication and visibility are enforced in SQL, not merely the UI.
  if(user==null){sql+=" AND r.kind='jobs' AND r.status='OPEN'";}
  else if(!"ADMIN".equals(user.getRole())){
   if("jobs".equals(kind)&&"FREELANCER".equals(user.getRole()))sql+=" AND r.status='OPEN'";
   else if("premium".equals(kind)||"categories".equals(kind)||"policies".equals(kind))sql+=" AND r.status IN ('AVAILABLE','ACTIVE','PUBLISHED')";
   else sql+=" AND (r.owner_id=? OR r.target_email=? OR (r.kind='applications' AND EXISTS(SELECT 1 FROM records j WHERE j.id=r.job_id AND j.kind='jobs' AND j.owner_id=?)) OR (r.kind='milestones' AND EXISTS(SELECT 1 FROM records pj WHERE pj.id=r.project_id AND pj.kind='projects' AND (pj.owner_id=? OR pj.target_email=?))))";
  }
  sql+=" ORDER BY r.id DESC LIMIT 300";
  List<WorkRecord> records=new ArrayList<>();try(Connection c=getConnection();PreparedStatement p=c.prepareStatement(sql)){
   p.setString(1,kind);if(user!=null&&!"ADMIN".equals(user.getRole())&&!(("jobs".equals(kind)&&"FREELANCER".equals(user.getRole()))||Set.of("premium","categories","policies").contains(kind))){p.setInt(2,user.getId());p.setString(3,user.getEmail());p.setInt(4,user.getId());p.setInt(5,user.getId());p.setString(6,user.getEmail());}
   try(ResultSet r=p.executeQuery()){while(r.next())records.add(read(r));}
  }return records;
 }
 public WorkRecord find(int id)throws SQLException{try(Connection c=getConnection();PreparedStatement p=c.prepareStatement("SELECT * FROM records WHERE id=?")){p.setInt(1,id);try(ResultSet r=p.executeQuery()){return r.next()?read(r):null;}}}
 public int insert(WorkRecord r)throws SQLException{
  String sql="INSERT INTO records(kind,owner_id,title,content,status,target_email,skill,location,due_date,amount,job_id,project_id,rating,client_approved,freelancer_approved) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  try(Connection c=getConnection();PreparedStatement p=c.prepareStatement(sql,Statement.RETURN_GENERATED_KEYS)){
   fill(p,r,false);p.executeUpdate();try(ResultSet ids=p.getGeneratedKeys()){if(ids.next())return ids.getInt(1);}throw new SQLException("Không tạo được mã dữ liệu");
  }
 }
 public void update(WorkRecord r)throws SQLException{
  String sql="UPDATE records SET title=?,content=?,status=?,target_email=?,skill=?,location=?,due_date=?,amount=?,job_id=?,project_id=?,rating=?,client_approved=?,freelancer_approved=? WHERE id=? AND kind=?";
  try(Connection c=getConnection();PreparedStatement p=c.prepareStatement(sql)){
   p.setString(1,r.title);p.setString(2,r.content);p.setString(3,r.status);p.setString(4,r.target);p.setString(5,r.skill);p.setString(6,r.location);p.setString(7,r.dueDate);p.setLong(8,r.amount);p.setObject(9,r.jobId>0?r.jobId:null,Types.INTEGER);p.setObject(10,r.projectId>0?r.projectId:null,Types.INTEGER);p.setInt(11,r.rating);p.setBoolean(12,r.clientApproved);p.setBoolean(13,r.freelancerApproved);p.setInt(14,r.id);p.setString(15,r.kind);if(p.executeUpdate()!=1)throw new SQLException("Không thể cập nhật dữ liệu");
  }
 }
 private void fill(PreparedStatement p,WorkRecord r,boolean ignored)throws SQLException{
  p.setString(1,r.kind);p.setInt(2,r.ownerId);p.setString(3,r.title);p.setString(4,r.content);p.setString(5,r.status);p.setString(6,r.target);p.setString(7,r.skill);p.setString(8,r.location);p.setString(9,r.dueDate);p.setLong(10,r.amount);p.setObject(11,r.jobId>0?r.jobId:null,Types.INTEGER);p.setObject(12,r.projectId>0?r.projectId:null,Types.INTEGER);p.setInt(13,r.rating);p.setBoolean(14,r.clientApproved);p.setBoolean(15,r.freelancerApproved);
 }
}