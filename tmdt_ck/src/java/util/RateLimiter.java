package util;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
/** Simple per-process guard; production deployments should also configure reverse-proxy rate limiting. */
public final class RateLimiter {
 private static final ConcurrentHashMap<String,Entry> entries=new ConcurrentHashMap<>();
 private record Entry(long resetAt,AtomicInteger count){}
 private RateLimiter(){}
 public static boolean allow(String key,int max,long periodMs){
  long now=System.currentTimeMillis();
  if(entries.size()>10000)entries.entrySet().removeIf(e->e.getValue().resetAt<now);
  Entry entry=entries.compute(key,(k,v)->v==null||v.resetAt<now?new Entry(now+periodMs,new AtomicInteger()):v);
  return entry.count.get()<max;
 }
 public static void failure(String key,int windowMillis){
  long now=System.currentTimeMillis();entries.compute(key,(k,v)->{if(v==null||v.resetAt<now)v=new Entry(now+windowMillis,new AtomicInteger());v.count.incrementAndGet();return v;});
 }
 public static void success(String key){entries.remove(key);}
}
