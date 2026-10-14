# Change log / lỗi tìm thấy — TalentMatch_Source_01_Auth

## Nguyên nhân và xử lý

| Hiện trạng của bản gốc | Thay đổi trong Source 01 |
|---|---|
| `backend/.env` đang dùng SMTP localhost:1025 và Mailpit: Gmail không nhận email | Giữ cấu hình Mailpit dev, bổ sung `MAIL_PROVIDER=resend` hoặc SMTP thật; hướng dẫn các bước gửi Gmail thật mà không cần domain ngay lập tức bằng SMTP được cấp phép. |
| Đăng ký trả lỗi 503 khi mail không gửi mặc dù tài khoản đã được tạo | Trả 201 với `emailSent=false`, giữ tài khoản pending và hỗ trợ gửi lại. |
| Không có giới hạn gửi lại theo tài khoản cho resend/forgot | Thêm cooldown 60 giây, giới hạn 5 lần/giờ theo bản ghi token, serialize yêu cầu bằng PostgreSQL row-lock; vẫn duy trì rate limit IP hiện có. |
| Xác minh/reset dùng `findUnique` trước `delete` | Consume token bằng deleteMany có ràng buộc hạn dùng ngay trong transaction, chống dùng lại token. |
| Google code flow có PKCE nhưng không check nonce | Thêm nonce, yêu cầu exp và so khớp state; vẫn kiểm tra issuer/audience/signature bằng jose. |
| Facebook mặc dù email không được attested vẫn tạo session | Bắt xác minh qua mailbox trước khi cấp session với account chưa xác minh, giữ quy tắc không auto-merge email. |
| Callback OAuth trả lỗi JSON khó hiểu | Redirect về login với mã lỗi hạn chế, không để lộ code/secret/provider token. |
| Form đăng ký không phân biệt email gửi thành công/thất bại; verify trong React StrictMode có thể gửi 2 request | Hiển thị trạng thái lỗi gửi, tránh gọi verify hai lần, thông báo Google/Meta error. |
| Chưa có kiểm thử tự động sâu cho auth | Bổ sung HTTP mock test và Resend adapter test. |

## File thay đổi

**Sửa:**
- `backend/src/routes/auth.js` — đăng ký/xác minh/login/logout/reset rõ trạng thái, kiểm tra mật khẩu có chữ/số và consume token.
- `backend/src/routes/oauth.js` — Google nonce + exp, Facebook xác minh mailbox, timeout và error redirects.
- `backend/src/lib/mail.js` — SMTP/Resend adapter, timeout, idempotency, acknowledgement.
- `backend/.env.example` — chọn mail adapter và Resend key placeholder trống.
- `backend/package.json` — kích hoạt Node module mocks trong test script.
- `frontend/src/pages/Auth.jsx` — phản hồi khi đăng ký gửi email lỗi, provider errors.
- `frontend/src/pages/AccountAccess.jsx` — mô tả email và chống double submit verify.
- `docs/OAUTH_SETUP.md`, `docs/ENVIRONMENT.md`, `README.md` — làm rõ trạng thái và tài liệu bản này.

**Tạo mới:**
- `backend/src/services/accountEmail.js` — thống nhất tạo token, rate limit và gửi email.
- `backend/tests/auth-flow.test.js` — test API contract qua Express và mocks.
- `backend/tests/mail-provider.test.js` — test định dạng email và Resend adapter.
- `docs/AUTH_SETUP_SOURCE_01.md` — hướng dẫn cài đặt và thử 6 luồng.
- `docs/TEST_REPORT_SOURCE_01.md` — báo cáo PASS/SKIP/chưa chạy.
- `docs/CHANGELOG_SOURCE_01_AUTH.md` — danh sách file, lý do, lỗi và phạm vi.

**Xóa:** không xóa file source nghiệp vụ nào. `node_modules` và `.env` chỉ **loại khỏi ZIP kết quả**, không bị xóa khỏi ZIP đầu vào.

## Tương thích và quản trị phiên bản

- Migration: **không thêm/sửa** vì schema hiện có đã đáp ứng. Sử dụng `prisma migrate status` và `migrate deploy` có backup.
- Không sửa module jobs, workspace, chat, payment, admin. Không sửa seed.
- File ZIP đầu ra dùng naming `TalentMatch_Source_01_Auth.zip`; đợt 02 phải dùng bản ZIP này làm input theo yêu cầu.
- Không có cam kết production cho provider/DB chưa được kiểm thử với quyền truy cập thực tế.
