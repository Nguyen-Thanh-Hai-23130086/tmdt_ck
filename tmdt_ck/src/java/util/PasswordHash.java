package util;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.SecureRandom;
import java.security.MessageDigest;
import java.util.Base64;
public final class PasswordHash {
 private static final int ITERATIONS=160000;
 private PasswordHash(){}
 public static String hash(String raw){
  if(raw==null||raw.length()<10)throw new IllegalArgumentException("Mật khẩu cần ít nhất 10 ký tự");
  byte[] salt=new byte[16];new SecureRandom().nextBytes(salt);
  return "pbkdf2_sha256$"+ITERATIONS+"$"+Base64.getEncoder().encodeToString(salt)+"$"+Base64.getEncoder().encodeToString(derive(raw.toCharArray(),salt,ITERATIONS));
 }
 public static boolean verify(String raw,String encoded){
  if(raw==null||encoded==null)return false;
  try{String[] parts=encoded.split("\\$");if(parts.length!=4||!parts[0].equals("pbkdf2_sha256"))return false;
   int iter=Integer.parseInt(parts[1]);if(iter<100000||iter>500000)return false;
   byte[] salt=Base64.getDecoder().decode(parts[2]);byte[] expected=Base64.getDecoder().decode(parts[3]);
   return salt.length==16&&expected.length==32&&MessageDigest.isEqual(expected,derive(raw.toCharArray(),salt,iter));
  }catch(Exception e){return false;}
 }
 private static byte[] derive(char[] chars,byte[] salt,int iterations){PBEKeySpec spec=new PBEKeySpec(chars,salt,iterations,256);try{return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();}catch(Exception e){throw new IllegalStateException("Password hashing unavailable",e);}finally{spec.clearPassword();}}
}