# ENVIRONMENT

Nguồn mẫu: `backend/.env.example`; sao chép thành `backend/.env` và không commit file thật.

| Biến | Mục đích |
|---|---|
| `DATABASE_URL` | Chuỗi kết nối PostgreSQL, chỉ dùng thông tin dev trong example |
| `PORT` | Cổng Express backend, mặc định 4000 |
| `FRONTEND_URL` | Origin frontend, dùng CORS, origin mutation và link email; mặc định http://localhost:5173 |
| `BACKEND_URL` | URL public backend dùng cho OAuth callback |
| `NODE_ENV` | `development` hoặc `production`; seed cấm production |
| `UPLOAD_DIR` | Thư mục lưu ảnh public, mặc định uploads/public (relative tới backend cwd) |
| `SMTP_HOST` | Host SMTP, `localhost` cho Mailpit trên Windows |
| `SMTP_PORT` | SMTP port, `1025` cho Mailpit |
| `SMTP_SECURE` | `true` nếu SMTP kết nối TLS ngay (thường port 465) |
| `SMTP_USER`, `SMTP_PASSWORD` | Tài khoản SMTP thật nếu có; để trống cho Mailpit |
| `MAIL_FROM` | Người gửi email xác minh và reset |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth client Web |
| `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET` | Facebook OAuth ứng dụng |
| `FACEBOOK_API_VERSION` | Phiên bản Graph API đã chốt trong source |

Không đưa token, email credentials, client secret hoặc password production vào Git/ZIP công khai. Với deployment production cần HTTPS, origin, secure cookies, storage và hệ thống backup được kiểm tra lại.

## Source 01 Auth — cấu hình email mở rộng

- `MAIL_PROVIDER`: `smtp` (mặc định) hoặc `resend`.
- `MAIL_TIMEOUT_MS`: timeout mỗi yêu cầu gửi email (mặc định 10000 ms).
- `RESEND_API_KEY`: bắt buộc khi chọn `resend` (không commit).
- `MAIL_FROM`: phải là sender được nhà cung cấp cho phép.

Cách dùng Gmail SMTP/Resend và giới hạn test sender: xem `AUTH_SETUP_SOURCE_01.md`.
