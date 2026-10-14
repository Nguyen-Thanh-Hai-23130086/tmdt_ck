# API DOCUMENTATION — bản nâng cấp

Root `http://localhost:4000/api`. Frontend Vite proxy `/api` và `/uploads` đến backend. API JSON trừ upload `multipart/form-data`. Phiên xác thực lưu trong cookie httpOnly `tm_session`; không gửi role/user ID từ frontend để tự cấp quyền.

## Tài khoản

| Method | Endpoint | Vai trò | Chức năng |
|---|---|---|---|
| GET | `/health` | Public | DB health check |
| POST | `/auth/register` | Public | name/email/password/role; tạo account chưa xác minh và gửi mail |
| POST | `/auth/verify-email` | Public | `{token}`; link dùng một lần |
| POST | `/auth/resend-verification` | Public | `{email}`; gửi lại mail |
| POST | `/auth/forgot-password` | Public | `{email}`; token reset email |
| POST | `/auth/reset-password` | Public | `{token,password}`; thu hồi session cũ |
| POST | `/auth/login` | Public | `{email,password}`; yêu cầu verified account |
| GET | `/auth/me` | Logged in | Người dùng hiện hành |
| POST | `/auth/logout` | Logged in/Guest | Thu hồi session/cookie |
| GET | `/oauth/status` | Public | Provider nào đã cấu hình |
| GET | `/oauth/:provider/start?role=CLIENT` | Public | OAuth Google/Facebook login |
| GET | `/oauth/:provider/start?link=1` | Client/Freelancer đã login | Liên kết OAuth vào account hiện tại |
| GET | `/oauth/:provider/callback` | Browser OAuth redirect | Verify OAuth, create session/link |

## Hồ sơ, tìm việc và matching

| Method | Endpoint | Vai trò | Chức năng |
|---|---|---|---|
| GET/PATCH | `/profile/me` | Logged in | Hồ sơ cá nhân/company/freelancer |
| POST/DELETE | `/profile/avatar` | Logged in | Multipart JPEG/PNG/WebP và xóa ảnh |
| POST/DELETE | `/profile/company/logo` | Client | Upload/xóa logo |
| GET | `/profile/freelancers?q=&skill=&page=` | Public | Danh sách phân trang |
| GET | `/profile/freelancers/:id` | Public | Hồ sơ freelancer |
| POST | `/profile/portfolio` | Freelancer | Thêm portfolio có imageUrl local |
| PATCH/DELETE | `/profile/portfolio/:id` | Chủ portfolio | Sửa/xóa portfolio |
| POST | `/profile/portfolio/image` | Freelancer | Upload ảnh portfolio |
| GET | `/jobs?q=&skill=&page=` | Public | Danh sách dự án đang tuyển |
| GET | `/jobs/:id` | Public | Chi tiết dự án |
| GET | `/jobs/mine` | Client | Dự án bản thân |
| POST/PATCH | `/jobs` hoặc `/jobs/:id` | Client | Đăng và sửa dự án |
| POST | `/jobs/:id/close` | Client owner | Đóng dự án công khai |
| GET | `/jobs/:id/matches` | Client owner | Xếp hạng theo luật, tối đa 12 freelancer |
| POST | `/jobs/:id/apply` | Freelancer | Gửi đề xuất |
| GET | `/jobs/applications/mine` | Freelancer | Ứng tuyển cá nhân |
| POST | `/jobs/:id/applications/withdraw` | Freelancer | Rút đề xuất |
| GET | `/jobs/:id/applications` | Client owner | Xem danh sách ứng viên |
| POST | `/jobs/:id/applications/:aid/reject` | Client owner | Từ chối ứng tuyển |
| POST | `/jobs/:id/accept/:applicationId` | Client owner | Chọn freelancer, tạo workspace |

## Lời mời, workspace và admin

| Method | Endpoint | Vai trò | Chức năng |
|---|---|---|---|
| GET | `/invitations/mine` | Client/Freelancer | Lời mời đã gửi/nhận |
| POST | `/invitations` | Client | Mời freelancer vào dự án đang tuyển |
| POST | `/invitations/:id/respond` | Freelancer được mời | ACCEPTED/DECLINED; ACCEPTED tạo đề xuất |
| GET | `/workspaces/mine` | Logged in | Workspace liên quan |
| GET | `/workspaces/:id` | Thành viên hoặc Admin | Workspace đầy đủ |
| POST | `/workspaces/:id/milestones` | Client member | Tạo milestone |
| POST | `/workspaces/:id/milestones/:mid/submit` | Freelancer member | Bàn giao |
| POST | `/workspaces/:id/milestones/:mid/review` | Client member | APPROVED/REVISION |
| POST | `/workspaces/:id/complete` | Client member | Hoàn tất khi mọi milestone đã duyệt |
| POST | `/workspaces/:id/payment-demo` | Client member | Ghi nhận thanh toán mô phỏng |
| GET/POST | `/workspaces/:id/messages` | Workspace member | Tin nhắn lưu DB |
| POST | `/workspaces/:id/reviews` | Workspace member | Đánh giá sau khi hoàn thành |
| GET/POST | `/complaints/mine` hoặc `/complaints` | Logged in | Danh sách/tạo khiếu nại trong workspace sở hữu |
| GET | `/notifications` | Logged in | Thông báo cá nhân |
| POST | `/notifications/read` | Logged in | Đánh dấu đã đọc |
| GET | `/admin/stats`, `/admin/users`, `/admin/jobs`, `/admin/audit` | Admin | Tổng quan người dùng, dự án, log |
| PATCH | `/admin/users/:id/lock` | Admin | Khóa/mở khóa account, thu hồi session |
| POST | `/admin/jobs/:id/moderate` | Admin | Ẩn/mở job công khai hoặc bị hủy |
| GET | `/admin/transactions` | Admin | Xem giao dịch mô phỏng |
| GET | `/admin/reviews` | Admin | Danh sách đánh giá |
| PATCH | `/admin/reviews/:id/moderate` | Admin | Ẩn/hiện review (không xóa) |
| GET | `/admin/complaints` | Admin | Khiếu nại và reporter |
| PATCH | `/admin/complaints/:id` | Admin | REVIEWING/RESOLVED/DISMISSED + phản hồi |

## Quy tắc quan trọng

- Dữ liệu đầu vào dùng Zod; các thao tác có role guard và kiểm tra ownership ở backend.
- Đơn ứng tuyển unique `(jobId,freelancerId)`; chỉ chọn được khi job PUBLISHED, chọn một freelancer qua database transaction.
- Milestone trạng thái OPEN → SUBMITTED → APPROVED/REVISION; REVISION → SUBMITTED.
- Matching **theo quy tắc**, không phải mô hình AI thật: 70 điểm kỹ năng, tối đa 20 điểm mức giá, 10 điểm kinh nghiệm.
- Phân trang freelancer/job tối đa 12 mục/page; bảng Admin tối đa 100 dòng và cần mở rộng pagination nếu dữ liệu tăng.
- API URL trong local ví dụ; trước triển khai production cần kiểm tra lại origin, HTTPS, rate limiting, CSRF và secrets.
