# ARCHITECTURE — TalentMatch phiên bản nâng cấp

## Stack giữ nguyên từ MVP

- Frontend React 19, Vite 6, React Router, Lucide; CSS hiện có giữ nguyên phong cách professional × creative. Header chuyển sticky, UI email/portfolio/invites/admin được thêm vào các trang tương ứng.
- Backend Node.js 20+, Express 4 REST, Zod validation, bcryptjs hash, cookie-parser, jose (Google JWT verify), Multer + file-type + Sharp (JPEG/PNG/WebP to WebP), Nodemailer SMTP.
- PostgreSQL 16, Prisma ORM 6.4.1, migration liên tiếp. Không tự reset database.
- `concurrently` quản lý frontend/backend qua script `npm run dev` trên PowerShell.
- Docker Compose dùng cho PostgreSQL + Mailpit, không buộc frontend/backend chạy trong Docker.

## Luồng dữ liệu

1. UI gửi HTTP `/api/...` qua Vite proxy tới Express; session lưu trên cookie httpOnly, backend tra hash session ở DB.
2. Endpoint yêu cầu đăng nhập dùng middleware `auth`/`roles`, kiểm tra chủ sở hữu trước mỗi thao tác.
3. Client đăng job; Freelancer gửi application; transaction chọn ứng viên tạo workspace + giao dịch demo.
4. Workspace kiểm soát thành viên và state machine OPEN/SUBMITTED/REVISION/APPROVED; hoàn tất khi đủ milestone.
5. Chat và notification ghi PostgreSQL; giao diện cập nhật khi reload, không tuyên bố realtime.
6. Ảnh được backend đọc memory dưới giới hạn dung lượng, xác minh type, dùng Sharp xuất WebP ra `UPLOAD_DIR`; URL nằm trong PostgreSQL. Ảnh demo seed là SVG tự sinh trong thư mục `demo`.
7. Email verification/reset sử dụng token ngẫu nhiên; DB chỉ lưu SHA256 hash + expiry, Nodemailer gửi qua SMTP/Mailpit. Reset thu hồi session cũ.
8. OAuth dùng state DB+cookie, Google PKCE + JWT verify, Facebook token debug; liên kết provider phải bắt đầu từ phiên đăng nhập hiện có.

## Tiêu chí ràng buộc dữ liệu

Các khóa duy nhất quan trọng: User.email, Session.tokenHash, EmailToken.tokenHash, OAuthAccount(provider, providerUserId), Application(jobId,freelancerId), Invitation(jobId,freelancerId), Workspace.jobId, Transaction.reference và Review(workspaceId, authorId).

## Phạm vi còn thiếu

Không có AI model thực, Redis, WebSocket, escrow/payment gateway thật, object storage production, transactional email queue, CV private vault hoặc i18n tập trung 100%. Các nội dung này không được mô tả như đã hoàn thiện.
