package service;
import java.sql.*;import java.util.*;import model.*;import dao.*;
public class WorkService {
 private final RecordDao dao;private final UserDao users;
 public WorkService(){this(new RecordDao(),new UserDao());}
 public WorkService(RecordDao dao,UserDao users){this.dao=dao;this.users=users;}
 public static final Set<String> KINDS=Set.of("jobs","applications","invitations","agreements","projects","milestones","messages","payments","reviews","credits","premium","reports","notifications","categories","policies");
 private static final Map<String,Set<String>> STATUSES=Map.ofEntries(
  Map.entry("jobs",Set.of("OPEN","PAUSED","CLOSED")),Map.entry("applications",Set.of("PENDING","SHORTLISTED","ACCEPTED","REJECTED")),Map.entry("invitations",Set.of("PENDING","ACCEPTED","REJECTED","CANCELLED")),Map.entry("agreements",Set.of("DRAFT","SIGNED","CANCELLED")),Map.entry("projects",Set.of("IN_PROGRESS","REVIEW","COMPLETED")),Map.entry("milestones",Set.of("TODO","IN_PROGRESS","SUBMITTED","REVISION","ACCEPTED")),Map.entry("messages",Set.of("SENT","READ")),Map.entry("payments",Set.of("PENDING","RECORDED","CANCELLED")),Map.entry("reviews",Set.of("PUBLISHED","HIDDEN")),Map.entry("credits",Set.of("PENDING","APPROVED")),Map.entry("premium",Set.of("AVAILABLE","REQUESTED","ACTIVE")),Map.entry("reports",Set.of("OPEN","INVESTIGATING","RESOLVED","REJECTED")),Map.entry("notifications",Set.of("UNREAD","READ")),Map.entry("categories",Set.of("ACTIVE","HIDDEN")),Map.entry("policies",Set.of("DRAFT","PUBLISHED")));
 private static final Map<String,String> INITIAL=Map.ofEntries(Map.entry("jobs","OPEN"),Map.entry("applications","PENDING"),Map.entry("invitations","PENDING"),Map.entry("agreements","DRAFT"),Map.entry("projects","IN_PROGRESS"),Map.entry("milestones","TODO"),Map.entry("messages","SENT"),Map.entry("payments","PENDING"),Map.entry("reviews","PUBLISHED"),Map.entry("credits","PENDING"),Map.entry("premium","AVAILABLE"),Map.entry("reports","OPEN"),Map.entry("notifications","UNREAD"),Map.entry("categories","ACTIVE"),Map.entry("policies","DRAFT"));
 public List<Map<String,Object>> list(String kind,User user)throws SQLException{
  if("users".equals(kind)){authorize(user,"ADMIN");return users.listUsers(false);}
  if("freelancers".equals(kind)){return users.listFreelancers(user!=null&&(user.getRole().equals("CLIENT")||user.getRole().equals("ADMIN")));}
  if(!KINDS.contains(kind))throw new IllegalArgumentException("Loại dữ liệu không hỗ trợ");
  if(user==null&&!"jobs".equals(kind))throw new SecurityException("Yêu cầu đăng nhập");
  List<Map<String,Object>> list=new ArrayList<>();for(WorkRecord r:dao.list(kind,user))list.add(r.publicMap());return list;
 }
 public WorkRecord create(String kind,User actor,Map<String,String> input)throws SQLException{
  if(!KINDS.contains(kind))throw new IllegalArgumentException("Dữ liệu không hỗ trợ");authorizeCreate(kind,actor);
  WorkRecord r=new WorkRecord();r.kind=kind;r.ownerId=actor.getId();r.status=INITIAL.get(kind);if("premium".equals(kind)&&!"ADMIN".equals(actor.getRole()))r.status="REQUESTED";applyInput(r,input);
  if("premium".equals(kind)&&!"ADMIN".equals(actor.getRole())){r.amount=0;r.content="Yêu cầu quan tâm gói; chưa thanh toán.";}
  if("applications".equals(kind)){WorkRecord job=dao.find(r.jobId);if(job==null||!"jobs".equals(job.kind)||!"OPEN".equals(job.status))throw new IllegalArgumentException("Công việc không tồn tại hoặc đã đóng");if(job.ownerId==actor.getId())throw new SecurityException("Không thể ứng tuyển công việc của chính mình");r.target=users.findById(job.ownerId).getEmail();}
  if("milestones".equals(kind)){WorkRecord project=dao.find(r.projectId);if(project==null||!"projects".equals(project.kind)||project.ownerId!=actor.getId())throw new SecurityException("Dự án không thuộc sở hữu của bạn");r.target=project.target;}
  if("invitations".equals(kind)&& (r.target==null||r.target.isBlank()))throw new IllegalArgumentException("Cần email Freelancer nhận lời mời");
  r.id=dao.insert(r);return dao.find(r.id);
 }
 private void authorizeCreate(String kind,User user){if(user==null)throw new SecurityException("Yêu cầu đăng nhập");String role=user.getRole();if("ADMIN".equals(role))return;
  if("CLIENT".equals(role)&&Set.of("jobs","invitations","agreements","projects","milestones","messages","reports","reviews","premium").contains(kind))return;
  if("FREELANCER".equals(role)&&Set.of("applications","messages","reports","reviews","premium").contains(kind))return;
  throw new SecurityException("Vai trò không có quyền tạo loại dữ liệu này");
 }
 public WorkRecord modify(String kind,int id,User actor,Map<String,String> input)throws SQLException{
  if(actor==null)throw new SecurityException("Yêu cầu đăng nhập");WorkRecord r=dao.find(id);
  if(r==null||!r.kind.equals(kind))throw new IllegalArgumentException("Không tìm thấy dữ liệu");
  boolean admin="ADMIN".equals(actor.getRole());boolean owner=r.ownerId==actor.getId(),target=actor.getEmail().equalsIgnoreCase(r.target==null?"":r.target);
  boolean employerForProposal=false;
  if("premium".equals(kind)&&!"ADMIN".equals(actor.getRole())){r.amount=0;r.content="Yêu cầu quan tâm gói; chưa thanh toán.";}
  if("applications".equals(kind)){WorkRecord job=dao.find(r.jobId);employerForProposal=job!=null&&job.ownerId==actor.getId();}
  boolean onProject=false;
  if("milestones".equals(kind)){WorkRecord project=dao.find(r.projectId);onProject=project!=null&&(project.ownerId==actor.getId()||actor.getEmail().equalsIgnoreCase(project.target==null?"":project.target));}
  if(admin&&Set.of("agreements","projects","milestones").contains(kind))throw new SecurityException("Quản trị viên chỉ được xem tiến độ, không xác nhận thay người tham gia");
  if(!admin&&!owner&&!target&&!employerForProposal&&!onProject)throw new SecurityException("Không có quyền thao tác bản ghi");
  String next=input.get("status");
  if(next!=null){if(!STATUSES.get(kind).contains(next))throw new IllegalArgumentException("Trạng thái không hợp lệ");
   if(!admin&&!validTransition(r,actor,next,owner,target,employerForProposal,onProject))throw new SecurityException("Chuyển trạng thái không được phép");if("agreements".equals(kind)&&"SIGNED".equals(next)&&!admin){
    if(owner&&"CLIENT".equals(actor.getRole()))r.clientApproved=true;
    if(target&&"FREELANCER".equals(actor.getRole()))r.freelancerApproved=true;
    r.status=r.clientApproved&&r.freelancerApproved?"SIGNED":"DRAFT";
   }else r.status=next;
  }else{
   if(!admin&&!owner)throw new SecurityException("Không được sửa nội dung người khác");
   if(!admin&&!(Set.of("OPEN","DRAFT","PENDING","IN_PROGRESS","TODO","SENT").contains(r.status)))throw new SecurityException("Bản ghi đã khóa chỉnh sửa");
   applyInput(r,input);
  }
  dao.update(r);return dao.find(id);
 }
 private boolean validTransition(WorkRecord r,User u,String next,boolean owner,boolean target,boolean employerForProposal,boolean projectMember){
  if(next.equals(r.status))return true;
  return switch(r.kind){
   case "jobs" -> owner&&"CLIENT".equals(u.getRole())&&Set.of("OPEN","PAUSED","CLOSED").contains(next);
   case "applications" -> employerForProposal&&"CLIENT".equals(u.getRole())&&Set.of("PENDING","SHORTLISTED").contains(r.status)&&Set.of("SHORTLISTED","ACCEPTED","REJECTED").contains(next);
   case "invitations" -> target&&"FREELANCER".equals(u.getRole())&&"PENDING".equals(r.status)&&Set.of("ACCEPTED","REJECTED").contains(next)||owner&&"CLIENT".equals(u.getRole())&&"PENDING".equals(r.status)&&"CANCELLED".equals(next);
   case "agreements" -> ((owner&&"CLIENT".equals(u.getRole()))||(target&&"FREELANCER".equals(u.getRole())))&&"DRAFT".equals(r.status)&&"SIGNED".equals(next);
   case "projects" -> target&&"FREELANCER".equals(u.getRole())&&"IN_PROGRESS".equals(r.status)&&"REVIEW".equals(next)||owner&&"CLIENT".equals(u.getRole())&&"REVIEW".equals(r.status)&&"COMPLETED".equals(next);
   case "milestones" -> projectMember&&"CLIENT".equals(u.getRole())&&"TODO".equals(r.status)&&"IN_PROGRESS".equals(next)||projectMember&&"FREELANCER".equals(u.getRole())&&"IN_PROGRESS".equals(r.status)&&"SUBMITTED".equals(next)||projectMember&&"CLIENT".equals(u.getRole())&&"SUBMITTED".equals(r.status)&&Set.of("ACCEPTED","REVISION").contains(next)||projectMember&&"FREELANCER".equals(u.getRole())&&"REVISION".equals(r.status)&&"SUBMITTED".equals(next);
   case "notifications" -> owner&&"READ".equals(next);
   default -> false;
  };
 }
 private void applyInput(WorkRecord r,Map<String,String> input){
  if(input.containsKey("title"))r.title=limit(input.get("title"),200);if(input.containsKey("content"))r.content=limit(input.get("content"),3000);if(input.containsKey("skill"))r.skill=limit(input.get("skill"),300);
  if(input.containsKey("location"))r.location=limit(input.get("location"),150);
  if(input.containsKey("target"))r.target=limit(input.get("target").trim().toLowerCase(Locale.ROOT),180);
  if(input.containsKey("dueDate"))r.dueDate=limit(input.get("dueDate"),40);
  if(input.containsKey("amount")){try{r.amount=Long.parseLong(input.get("amount"));}catch(NumberFormatException e){throw new IllegalArgumentException("Số tiền không hợp lệ");}if(r.amount<0||r.amount>100000000000L)throw new IllegalArgumentException("Giá trị ngoài giới hạn");}
  if(input.containsKey("rating")){try{r.rating=Integer.parseInt(input.get("rating"));}catch(NumberFormatException e){throw new IllegalArgumentException("Số sao không hợp lệ");}if(r.rating<1||r.rating>5)throw new IllegalArgumentException("Số sao cần từ 1 đến 5");}
  if(input.containsKey("jobId"))r.jobId=parseId(input.get("jobId"));if(input.containsKey("projectId"))r.projectId=parseId(input.get("projectId"));
  if(r.title==null||r.title.isBlank()||r.content==null||r.content.isBlank())throw new IllegalArgumentException("Cần tiêu đề và mô tả");
 }
 private int parseId(String v){try{return Integer.parseInt(v);}catch(Exception e){throw new IllegalArgumentException("ID liên kết không hợp lệ");}}
 private String limit(String s,int n){if(s==null)return "";if(s.length()>n)throw new IllegalArgumentException("Dữ liệu vượt độ dài cho phép");return s.trim();}
 private void authorize(User u,String role){if(u==null||!role.equals(u.getRole()))throw new SecurityException("Không có quyền truy cập");}
 public void changeUserStatus(User admin,int id,String status)throws SQLException{authorize(admin,"ADMIN");if(id==admin.getId())throw new SecurityException("Không được tự khóa tài khoản");if(!Set.of("ACTIVE","SUSPENDED").contains(status))throw new IllegalArgumentException("Trạng thái không hợp lệ");users.setStatus(id,status);}
}