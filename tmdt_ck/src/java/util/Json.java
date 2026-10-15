package util;
import java.util.*;
public final class Json {
 private Json(){}
 public static String encode(Object v){
  if(v==null)return "null";
  if(v instanceof Number||v instanceof Boolean)return v.toString();
  if(v instanceof Map<?,?> m){StringJoiner j=new StringJoiner(",","{","}");m.forEach((k,x)->j.add(encode(String.valueOf(k))+":"+encode(x)));return j.toString();}
  if(v instanceof Collection<?> c){StringJoiner j=new StringJoiner(",","[","]");for(Object x:c)j.add(encode(x));return j.toString();}
  String s=String.valueOf(v);StringBuilder out=new StringBuilder("\"");for(int i=0;i<s.length();i++){char c=s.charAt(i);switch(c){case '\"'->out.append("\\\"");case '\\'->out.append("\\\\");case '\n'->out.append("\\n");case '\r'->out.append("\\r");case '\t'->out.append("\\t");default->{if(c<32)out.append(String.format("\\u%04x",(int)c));else out.append(c);}}}return out.append('\"').toString();
 }
}