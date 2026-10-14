# TESTING — kịch bản và bằng chứng kiểm thử

## Kết quả thật của môi trường tạo source

| Bước | Kết quả |
|---|---|
| Unit test `node --test backend/tests/transitions.test.js backend/tests/matching.test.js` | **7/7 PASS** |
| `node --check` trên JS backend / seed | **PASS** |
| Parser TypeScript trên file JS/JSX frontend và JS backend | **PASS cú pháp** |
| npm install | **BLOCKED** — registry.npmjs.org trả EAI_AGAIN |
| Prisma validate/generate/migrate | **NOT RUN** — chưa có npm dependencies / PostgreSQL |
| Seed 100 accounts hai lần | **NOT RUN** — chưa có PostgreSQL |
| Vite build | **NOT RUN** — chưa có npm dependencies |
| API integration / Mailpit / OAuth live / E2E | **NOT RUN** — thiếu services/credentials |
| Browser responsive/visual checks | **NOT RUN** |

**Không** diễn giải các bài test thuần logic thành bằng chứng rằng hệ thống hoàn chỉnh đã chạy được.

## Test trên Windows sau khi cài

```powershell
docker compose up -d db mailpit
Copy-Item backend/.env.example backend/.env
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:seed          # kiểm tra seed lặp, không trùng
npm test
npm run build
npm run dev
```

Mở `http://localhost:4000/api/health` và xác minh `database: connected`; mở `http://localhost:8025` thấy UI Mailpit. `npm test` mặc định bỏ qua integration vì `RUN_API_TESTS` không đặt, do đó còn phải thử API và UI.

## Test đăng ký email / reset

1. Đăng ký email mới; trước khi xác minh đăng nhập phải bị từ chối.
2. Mở Mailpit `:8025`, click link email, quay về `/verify-email` phải thành công.
3. Click lại link verify cũ phải báo không hợp lệ.
4. Đăng nhập thành công sau verify; thử sai mật khẩu phải bị từ chối.
5. Quên mật khẩu: email đã đăng ký và email chưa đăng ký trả thông báo dạng tương tự (chống dò email).
6. Mở reset link trong Mailpit, đặt mật khẩu mới, token cũ không thể tái sử dụng, session cũ bị thu hồi.
7. Tắt Mailpit và thử gửi mail để kiểm tra thông báo xử lý lỗi dịch vụ SMTP.

## Test upload

Tại `/profile`, thử upload avatar, company logo (Client), portfolio cover (Freelancer) bằng JPEG/PNG/WebP dưới 5MB. Tải lại trang và restart backend xem ảnh có giữ; thử file .txt và file lớn hơn 5MB để kiểm tra từ chối. Đăng nhập account khác, thử sửa/xóa portfolio của account đầu để kiểm tra ownership.

## Test seed 100 tài khoản

Sau 2 lần chạy `npm run db:seed`, dùng Prisma Studio hoặc câu lệnh SQL đọc bảng User:

```sql
SELECT "role", COUNT(*) FROM "User" WHERE "isDemo" = true GROUP BY "role";
SELECT COUNT(*) FROM "JobPost" WHERE "isDemo" = true;
SELECT COUNT(*) FROM "Workspace";
SELECT COUNT(*) FROM "PortfolioItem";
```

Với database trống ban đầu, kỳ vọng 2/23/75 tài khoản, ít nhất 36 job demo và 15 workspace. Kiểm tra ảnh demo qua `/uploads/demo/avatar-000.svg` và portfolio. Nếu DB có dữ liệu cũ, số tổng có thể lớn hơn; không xóa DB để ép khớp số.

## API E2E local

Khi `npm run dev` đang chạy và seed đã thành công, ở terminal khác có thể chạy `npm run test:e2e` (chỉ localhost). Script tạo một job demo mới, Client đăng job, Freelancer apply, Client accept, tạo workspace/milestone, chat, bàn giao, nghiệm thu, thanh toán demo, đánh giá và Admin kiểm tra tổng số account. **Script có thêm dữ liệu vào DB, không xóa; chỉ chạy trên database development/test.**

OAuth phải kiểm tra riêng trên provider thật khi đã có credentials; không đánh dấu test pass chỉ vì API callback tồn tại. Kiểm tra màn hình 360/768/1024/1440 px bằng browser và xem console/network trước khi nghiệm thu UI.
