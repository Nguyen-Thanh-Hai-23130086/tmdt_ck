package model;
import java.sql.Timestamp;
public class User implements java.io.Serializable {
 private static final long serialVersionUID=1L;
 private int id; private String fullName,email,password,role,status; private Timestamp createdAt;
 public int getId(){return id;} public void setId(int v){id=v;}
 public String getFullName(){return fullName;} public void setFullName(String v){fullName=v;}
 public String getEmail(){return email;} public void setEmail(String v){email=v;}
 public String getPassword(){return password;} public void setPassword(String v){password=v;}
 public String getRole(){return role;} public void setRole(String v){role=v;}
 public String getStatus(){return status;} public void setStatus(String v){status=v;}
 public Timestamp getCreatedAt(){return createdAt;} public void setCreatedAt(Timestamp v){createdAt=v;}
}