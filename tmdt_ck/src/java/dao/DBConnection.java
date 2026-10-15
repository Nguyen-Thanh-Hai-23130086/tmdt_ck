package dao;
import java.sql.*;
import java.io.InputStream;
import java.util.Properties;
public final class DBConnection {
 private static final Properties props=new Properties();
 static {try(InputStream in=DBConnection.class.getClassLoader().getResourceAsStream("db.properties")){if(in!=null)props.load(in);}catch(Exception e){throw new ExceptionInInitializerError(e);}}
 private DBConnection(){}
 private static String conf(String key,String env,String fallback){String v=System.getenv(env);return v!=null&&!v.isBlank()?v:props.getProperty(key,fallback);}
 public static Connection getConnection() throws SQLException{
  String host=conf("db.host","TM_DB_HOST","localhost"), port=conf("db.port","TM_DB_PORT","3306"), db=conf("db.database","TM_DB_NAME","talentmatch");
  if(!host.matches("[a-zA-Z0-9.-]+")||!port.matches("[0-9]{2,5}")||!db.matches("[a-zA-Z0-9_]+"))throw new SQLException("Database configuration invalid");
  return DriverManager.getConnection("jdbc:mysql://"+host+":"+port+"/"+db+"?useUnicode=true&characterEncoding=utf8&connectionTimeZone=SERVER&useSSL=false",conf("db.username","TM_DB_USER","root"),conf("db.password","TM_DB_PASSWORD",""));
 }
}