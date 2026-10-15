import service.WorkService;
import dao.RecordDao;
import dao.UserDao;
import model.WorkRecord;
import model.User;
import java.util.*;
import java.sql.SQLException;
public class WorkServiceTest {
 static int count=0;
 static void check(String name,boolean ok){count++;if(!ok)throw new AssertionError(name);System.out.println("PASS "+name);}
 static User user(int id,String role,String email){User u=new User();u.setId(id);u.setRole(role);u.setEmail(email);u.setStatus("ACTIVE");return u;}
 static WorkRecord rec(int id,String kind,int owner,String status,String target){WorkRecord r=new WorkRecord();r.id=id;r.kind=kind;r.ownerId=owner;r.status=status;r.title="Demo";r.content="Description";r.target=target;return r;}
 static class MemoryDao extends RecordDao {
  Map<Integer,WorkRecord> map=new HashMap<>();int last=100;
  @Override public WorkRecord find(int id){return map.get(id);}
  @Override public int insert(WorkRecord r){r.id=++last;map.put(r.id,r);return r.id;}
  @Override public void update(WorkRecord r){map.put(r.id,r);}
  @Override public List<WorkRecord> list(String kind,User user){List<WorkRecord> list=new ArrayList<>();for(WorkRecord r:map.values())if(r.kind.equals(kind))list.add(r);return list;}
 }
 static class MemoryUserDao extends UserDao {
  Map<Integer,User> users=new HashMap<>();
  @Override public User findById(int id){return users.get(id);}
 }
 static boolean blocked(Runnable r){try{r.run();return false;}catch(SecurityException | IllegalArgumentException e){return true;}}
 public static void main(String[]args)throws Exception {
  MemoryDao d=new MemoryDao();MemoryUserDao users=new MemoryUserDao();WorkService s=new WorkService(d,users);
  User client=user(2,"CLIENT","client@example.test"), freelancer=user(7,"FREELANCER","freelancer@example.test"),outsider=user(8,"FREELANCER","other@example.test"),admin=user(1,"ADMIN","admin@example.test");
  for(User u:List.of(client,freelancer,outsider,admin))users.users.put(u.getId(),u);
  WorkRecord job=rec(11,"jobs",2,"OPEN",null);d.map.put(11,job);
  check("client creates job",s.create("jobs",client,Map.of("title","Another job","content","Requirements"))!=null);
  check("freelancer cannot create job",blocked(()->{try{s.create("jobs",freelancer,Map.of("title","Hack","content","N"));}catch(SQLException e){throw new RuntimeException(e);}}));
  WorkRecord application=s.create("applications",freelancer,Map.of("title","Proposal","content","Can work","jobId","11"));
  check("proposal owner/target",application.ownerId==7 && application.target.equals(client.getEmail()));
  check("cannot apply own job",blocked(()->{try{s.create("applications",client,Map.of("title","Own","content","N","jobId","11"));}catch(SQLException e){throw new RuntimeException(e);}}));
  check("other freelancer cannot accept proposal",blocked(()->{try{s.modify("applications",application.id,outsider,Map.of("status","ACCEPTED"));}catch(SQLException e){throw new RuntimeException(e);}}));
  WorkRecord selected=s.modify("applications",application.id,client,Map.of("status","ACCEPTED"));check("client chooses applicant",selected.status.equals("ACCEPTED"));
  check("invalid status rejected",blocked(()->{try{s.modify("jobs",11,client,Map.of("status","HACKED"));}catch(SQLException e){throw new RuntimeException(e);}}));
  WorkRecord invite=rec(22,"invitations",2,"PENDING",freelancer.getEmail());d.map.put(22,invite);
  check("non-target cannot accept invitation",blocked(()->{try{s.modify("invitations",22,outsider,Map.of("status","ACCEPTED"));}catch(SQLException e){throw new RuntimeException(e);}}));
  check("target may accept invitation",s.modify("invitations",22,freelancer,Map.of("status","ACCEPTED")).status.equals("ACCEPTED"));
  WorkRecord project=rec(30,"projects",2,"IN_PROGRESS",freelancer.getEmail());d.map.put(30,project);
  check("client cannot submit project for freelancer",blocked(()->{try{s.modify("projects",30,client,Map.of("status","REVIEW"));}catch(SQLException e){throw new RuntimeException(e);}}));
  check("admin cannot override project participant",blocked(()->{try{s.modify("projects",30,admin,Map.of("status","COMPLETED"));}catch(SQLException e){throw new RuntimeException(e);}}));
  check("freelancer may request project review",s.modify("projects",30,freelancer,Map.of("status","REVIEW")).status.equals("REVIEW"));
  check("client may finish reviewed project",s.modify("projects",30,client,Map.of("status","COMPLETED")).status.equals("COMPLETED"));
  WorkRecord milestone=rec(31,"milestones",2,"TODO",freelancer.getEmail());milestone.projectId=30;d.map.put(31,milestone);
  check("client starts milestone",s.modify("milestones",31,client,Map.of("status","IN_PROGRESS")).status.equals("IN_PROGRESS"));
  check("freelancer submits milestone",s.modify("milestones",31,freelancer,Map.of("status","SUBMITTED")).status.equals("SUBMITTED"));
  check("freelancer cannot approve their own delivery",blocked(()->{try{s.modify("milestones",31,freelancer,Map.of("status","ACCEPTED"));}catch(SQLException e){throw new RuntimeException(e);}}));
  check("client requests revision",s.modify("milestones",31,client,Map.of("status","REVISION")).status.equals("REVISION"));
  check("freelancer resubmits",s.modify("milestones",31,freelancer,Map.of("status","SUBMITTED")).status.equals("SUBMITTED"));
  check("client accepts delivery",s.modify("milestones",31,client,Map.of("status","ACCEPTED")).status.equals("ACCEPTED"));
  check("admin cannot self suspend",blocked(()->{try{s.changeUserStatus(admin,1,"SUSPENDED");}catch(SQLException e){throw new RuntimeException(e);}}));
  WorkRecord agreement=rec(40,"agreements",2,"DRAFT",freelancer.getEmail());d.map.put(40,agreement);
  check("client signature awaiting freelancer",s.modify("agreements",40,client,Map.of("status","SIGNED")).status.equals("DRAFT")&&agreement.clientApproved);
  check("freelancer signature completes agreement",s.modify("agreements",40,freelancer,Map.of("status","SIGNED")).status.equals("SIGNED")&&agreement.freelancerApproved);
  check("unrelated account cannot sign",blocked(()->{try{s.modify("agreements",40,outsider,Map.of("status","SIGNED"));}catch(SQLException e){throw new RuntimeException(e);}}));
  System.out.println("Work service tests passed: "+count);
 }
}
