import { ZodError } from 'zod';
export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export const fail = (status, message) => { throw new HttpError(status, message); };
export const wrap = fn => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next);
export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) return res.status(400).json({error: 'Dữ liệu chưa hợp lệ', issues: err.issues.map(i=>({field:i.path.join('.'),message:i.message}))});
  if (err.code === 'P2002') return res.status(409).json({error:'Dữ liệu đã tồn tại'});
  if (err.code === 'P2025') return res.status(404).json({error:'Không tìm thấy dữ liệu'});
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({error:'Tệp vượt quá 5 MB'});
  const status = err.status || 500;
  if(status === 500) console.error('[request-error]', err);
  return res.status(status).json({error: status===500 ? 'Lỗi máy chủ, vui lòng thử lại' : err.message});
}
