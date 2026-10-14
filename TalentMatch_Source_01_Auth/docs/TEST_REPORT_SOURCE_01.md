# Báo cáo kiểm thử — TalentMatch Source 01 Auth

## Phạm vi và môi trường

- Mã nguồn đầu vào: `TalentMatch.zip` (tạo trên Windows, đi kèm `node_modules` Windows).
- Môi trường chạy kiểm thử: Linux, Node.js 22.16.0, package JS từ archive gốc. Database PostgreSQL và container Mailpit không có sẵn trong môi trường thực thi này. Không có Google/Meta credentials hoặc Resend API key hợp lệ.
- Source của người dùng KHÔNG bị chỉnh sửa; không có lệnh ghi/xóa dữ liệu của PostgreSQL thật.

## Đã chạy thành công

- **15/15 kiểm thử thực sự được chạy đều PASS.** Bao gồm 6 bài HTTP contract test trong `auth-flow.test.js` (Express với DB/provider mock), 2 bài email adapter test trong `mail-provider.test.js`, 3 bài matching và 4 bài workflow nghiệp vụ cũ.
- Tình huống được mô phỏng và kiểm: đăng ký khi email lỗi, trùng email, gửi lại, token xác minh không hợp lệ/hết hạn/dùng lại, login sai và đúng, chưa xác minh, logout và truy cập lại, forgot không lộ tồn tại email, reset sai token và dùng lại, hủy session cũ, Google PKCE/nonce/state, invalid JWT và account collision; Facebook cần xác minh email/thiếu email/hủy consent/invalid token, và liên kết OAuth có session hiện tại.
- **17 file JSX/JS frontend** được kiểm tra cú pháp thành công bằng Babel parser.
- Các JS backend auth/email/OAuth được kiểm tra cú pháp (`node --check`) thành công.

## Chưa chạy hoặc chưa thể xác nhận

- 1 integration test `RUN_API_TESTS=1` (trong `integration.test.js`) được **SKIP** do không có PostgreSQL/API thật.
- Không chạy được full backend API + PostgreSQL migration + seed + end-to-end browser; **không thể khẳng định tất cả route hoạt động với database thật**.
- Không thực hiện gửi Gmail thật (không có provider credentials hợp lệ). Mailpit/SMTP và Resend mới chỉ kiểm tra logic/mocked response, chưa xác nhận delivery thật.
- Không thực hiện Google/Facebook Login với tài khoản thật (không có client ID/secret và quyền cấu hình app); test chỉ dùng provider doubles.
- **Build frontend bằng Vite không thực hiện thành công trên Linux**: archive cũ chứa node_modules Windows, thiếu package native `@rollup/rollup-linux-x64-gnu`. `npm ci` gặp lỗi tải dependencies do mạng registry không có sẵn. Cần `npm ci` từ máy người dùng có Internet và nền tảng tương ứng để build xác nhận.
- `prisma validate` không hoàn tất vì Prisma cố tải binary Linux tại `binaries.prisma.sh` nhưng DNS truy cập không khả dụng. Chưa có kiểm chứng migration/schema thực tế bằng Prisma CLI trong môi trường này.

## Cách kiểm tra nghiệm thu trên máy cá nhân

1. Chạy `npm ci` trên **máy đích**, sau đó `npm run test --workspace backend` và `npm run build`.
2. Chạy Docker PostgreSQL/Mailpit, `npm run db:generate`, `npm run db:migrate`, kiểm tra `/api/health`, chạy các thao tác thủ công mục 3 trong `AUTH_SETUP_SOURCE_01.md`.
3. Test các bước email xác minh/reset qua Mailpit. Thử tắt Mailpit để quan sát tình huống gửi thất bại.
4. Kích hoạt SMTP thật hoặc Resend bằng tài khoản chủ dự án, xác nhận provider tiếp nhận và email đến Gmail thật.
5. Kích hoạt Google/Meta, thử cả login mới, login đã tồn tại, account link, email không có, state/callback invalid, revoke token.
6. Trước production: kiểm thử SMTP/TLS/redirect HTTPS, rate limit qua reverse proxy, cookie, chính sách gửi thư, concurrent request và sao lưu database.

**Kết luận:** Source đã được sửa và kiểm thử mô phỏng, nhưng **CHƯA THỂ nghiệm thu end-to-end với hạ tầng thật**. Không đánh dấu 6 luồng sản xuất là đã hoạt động thật khi chưa có credentials và DB kiểm thử thực tế.
