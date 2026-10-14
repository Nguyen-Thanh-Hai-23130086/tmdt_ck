export async function api(url,options={}){
  let response;
  try { response=await fetch('/api'+url,{...options,credentials:'include',headers:{...(options.body instanceof FormData?{}:{'Content-Type':'application/json'}),...options.headers},body:options.body instanceof FormData?options.body:options.body?JSON.stringify(options.body):undefined}); }
  catch{throw new Error('Không thể kết nối máy chủ. Kiểm tra backend và thử lại.');}
  const result=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(result.error||`Yêu cầu thất bại (${response.status})`);
  return result;
}
export const money=n=>new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND',maximumFractionDigits:0}).format(Number(n||0));
export const shortDate=value=>value?new Intl.DateTimeFormat('vi-VN',{dateStyle:'medium'}).format(new Date(value)):'Chưa xác định';
