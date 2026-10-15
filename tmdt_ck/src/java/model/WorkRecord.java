package model;
import java.util.*;
public class WorkRecord {
 public int id,ownerId,jobId,projectId,rating;
 public boolean clientApproved,freelancerApproved;
 public String kind,title,content,status,target,skill,location,dueDate,createdAt;
 public long amount;
 public Map<String,Object> publicMap(){Map<String,Object> m=new LinkedHashMap<>();m.put("id",id);m.put("ownerId",ownerId);m.put("kind",kind);m.put("title",title);m.put("content",content);m.put("status",status);m.put("target",target);m.put("skill",skill);m.put("location",location);m.put("dueDate",dueDate);m.put("createdAt",createdAt);m.put("jobId",jobId);m.put("projectId",projectId);m.put("amount",amount);m.put("rating",rating);m.put("clientApproved",clientApproved);m.put("freelancerApproved",freelancerApproved);return m;}
}