# KNOWN LIMITATIONS — trạng thái trung thực

## 1. Kiểm thử đã thực hiện

- **Đã kiểm tra và đạt:** 7 unit tests thuần Node về state machine và matching; kiểm tra cú pháp backend bằng `node --check`; parser TypeScript kiểm tra JS/JSX; kiểm tra cấu trúc file/migration.
- **Đã code, chưa kiểm thử tích hợp:** đăng ký + email xác minh, reset password, SMTP, seed 100 tài khoản, các migration Prisma, portfolio/avater/logo upload, email/account OAuth linking, invitations, complaints, admin moderation, rule-based matching, frontend React.
- **Chờ cấu hình bên ngoài:** Google Cloud/Meta OAuth thật, SMTP thật nếu không dùng Mailpit.
- **Chưa thực hiện được trong môi trường tạo ZIP:** npm install, npm package-lock, `prisma validate/generate/migrate`, seed trên PostgreSQL, build Vite, chạy API thực, kiểm thử upload trên backend thật, E2E browser, Mailpit thực tế và test seed 2 lần trên database.

Không có Docker/PostgreSQL và kết nối npm registry trong môi trường tác giả. Không thể khẳng định code đã chạy end-to-end cho đến khi kiểm thử trên Windows/DB thật.

## 2. Chức năng chưa hoàn chỉnh

- OAuth Google/Facebook: code luồng và liên kết chủ động có sẵn, chưa được test provider thực, cần credentials/app policies.
- UI Việt/Anh chỉ dịch một phần, chưa chuyển toàn bộ nội dung sang localization tập trung.
- Responsive dùng CSS và header sticky, nhưng chưa chạy kiểm thử visual desktop/tablet/mobile.
- Chat cập nhật khi load hoặc sau thao tác; **không dùng WebSocket realtime**, người dùng phải reload để xem tin từ người khác.
- Matching theo tiêu chí kỹ năng/giá/kinh nghiệm đơn giản; **không có model AI**. Truy vấn ứng viên giới hạn 300 đầu tiên để tránh tải vô hạn, chưa đủ cho dữ liệu lớn.
- Chưa có CV riêng tư và phân quyền tải CV, favorites, dữ liệu kỹ năng N-N, hệ thống taxonomy/danh mục nâng cao.
- Upload ảnh WebP có preview avatar cơ bản; thiếu progress bar chuẩn xác, quản lý orphan portfolio files, virus scanning, cloud storage và quota.
- Chưa triển khai premium billing, escrow thật hoặc cổng thanh toán; tiền luôn là **mô phỏng**.
- Khiếu nại hỗ trợ gửi và Admin xử lý; chưa có quy trình tranh chấp tài chính, escalation hoặc SLA thực tế.
- Admin có user/job/complaint/review moderation/transaction listing/audit; còn thiếu thống kê chuyên sâu, bảng danh mục, skill taxonomy, báo cáo vi phạm độc lập.
- Không có background email queue, monitor production, spam protection phân tán, multi-instance session management.
- File `package-lock.json` chưa được tạo vì không cài npm dependencies được trong môi trường soạn mã. Cần chạy `npm install` trên máy có Internet và commit lockfile.

## 3. Bảo mật và triển khai

- **Chỉ dùng demo local**. Không triển khai Internet/production khi chưa audit bảo mật và chạy test.
- Mật khẩu demo cố định và password DB trong docker compose **không an toàn cho production**; thay toàn bộ credentials trước khi triển khai.
- HTTP session cookie dùng secure trong NODE_ENV=production. Cần HTTPS reverse proxy đúng cấu hình; Origin check là bảo vệ bổ sung, không thay thế đánh giá CSRF đầy đủ.
- Cần backup PostgreSQL và `backend/uploads/public` trước khi di chuyển server hoặc thay schema; không dùng migrate reset, xóa volume Docker, seed trên production.
- Nếu seed chạy lần nữa trên database đã có user demo chỉnh sửa bởi người dùng, code giữ nguyên profile và password hiện có, chỉ tạo các demo record thiếu. Không bảo đảm mọi quan hệ dữ liệu do người dùng sửa thủ công vẫn đúng; kiểm tra trước khi demo.
