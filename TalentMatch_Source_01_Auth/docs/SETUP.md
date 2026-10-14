# SETUP — Hướng dẫn cài Windows 10/11

## 1. Chuẩn bị

- Cài Node.js 20+ và npm, sau đó chạy `node --version` và `npm --version` trong VS Code Terminal.
- Cài Docker Desktop, khởi động Docker Desktop trước khi dùng `docker compose`.
- Giải nén ZIP, mở thư mục `TalentMatch` trong VS Code và mở **Terminal > New Terminal** (PowerShell).

## 2. Cài database + mail local

```powershell
docker compose up -d db mailpit
docker compose ps
Copy-Item backend/.env.example backend/.env
```

Trong `docker compose ps`, cả `db` và `mailpit` cần đang chạy. Mở `http://localhost:8025` để kiểm tra Mailpit. Cấu hình DB mặc định của source này là Postgres user `talentmatch`, password dev `talentmatch_dev`, DB `talentmatch`, port 5432. Chỉ dành cho máy development.

Nếu đã có PostgreSQL cục bộ đang dùng cổng 5432, **không xóa database đó**. Thay port container host (ví dụ `5433:5432`) và thay port tương ứng trong `backend/.env`. Không chạy reset hay drop schema.

## 3. Cài dependencies + khởi tạo schema

```powershell
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
```

`npm install` cần kết nối Internet với registry npm. Sau lần cài thành công, một file `package-lock.json` sẽ được tạo; hãy lưu/commit file đó cùng source để cố định dependencies. `db:migrate` dùng `prisma migrate deploy`, chỉ áp dụng migration còn thiếu, **không reset DB**.

Lệnh seed dùng tài khoản demo và dữ liệu gắn `isDemo`, không chạy nếu `NODE_ENV=production`. Lệnh này có thể chạy lại mà không tạo trùng tập demo định danh; không thay mật khẩu/tên/hồ sơ của tài khoản demo đã có. Không dùng seed thử nghiệm trên database công ty/production.

## 4. Khởi động với một terminal

```powershell
npm run dev
```

Frontend `http://localhost:5173`, backend `http://localhost:4000/api/health`, email local `http://localhost:8025`. Kiểm tra `/api/health` phải có `"database":"connected"`.

`Ctrl+C` để dừng frontend/backend. PostgreSQL và Mailpit do Docker quản lý, không dừng khi Ctrl+C. Dùng `docker compose stop` nếu muốn dừng container mà vẫn giữ dữ liệu. **Không chạy `docker compose down -v`** vì tham số `-v` có thể xóa volume dữ liệu.

## 5. Test tài khoản mới

1. Mở web, đăng ký bằng một địa chỉ email mới (ví dụ `test.local@example.test`) với vai trò Client hoặc Freelancer.
2. Không thể đăng nhập ngay khi chưa xác minh.
3. Mở Mailpit `http://localhost:8025`, mở email vừa nhận, nhấp liên kết xác minh (dẫn về `http://localhost:5173/verify-email?token=...`).
4. Đăng nhập bằng email/mật khẩu vừa tạo.
5. Đăng xuất; thử **Quên mật khẩu**, mở email đặt lại trong Mailpit, đặt mật khẩu mới và đăng nhập lại. Token chỉ dùng được một lần.

Nếu không thấy email, kiểm tra Docker Mailpit, `SMTP_HOST`, `SMTP_PORT`, log backend; có thể mở lại `/check-email` để gửi lại email xác minh.

## 6. Upload

Trên `/profile` chọn file JPEG/PNG/WebP tối đa 5MB. Server chuyển thành WebP và lưu tại `backend/uploads/public/`; endpoint public là `/uploads/...` thông qua proxy Vite. Seed cũng tạo minh họa SVG tại `backend/uploads/public/demo/`. File tồn tại sau khi khởi động lại backend vì lưu trên ổ đĩa; **không lưu thư mục này dưới version control nếu chứa ảnh người dùng thật**. Nếu chuyển máy phải sao lưu cả folder này và database.

## 7. Nếu lỗi

- `EADDRINUSE 5432`: PostgreSQL khác đang dùng port 5432; đổi port map + `.env`.
- `EADDRINUSE 4000/5173`: server khác đang chạy; dừng tiến trình trùng.
- `P1001/P1000`: DB chưa khởi động hoặc `DATABASE_URL` sai.
- Prisma `P2022`, thiếu cột: chạy `npm run db:migrate`, kiểm tra DB đang trỏ tới và history migration; không tự reset DB.
- `SMTP ECONNREFUSED`: Mailpit chưa chạy hoặc SMTP port không khớp.
- `npm ENOTFOUND/EAI_AGAIN`: mất Internet/DNS của registry npm; kiểm tra kết nối trước khi cài.
- OAuth báo chưa cấu hình: thêm credentials đúng theo `docs/OAUTH_SETUP.md` rồi khởi động lại backend.

## 8. Dùng SMTP thật

Mặc định SMTP local `localhost:1025`, không cần user/pass. Nếu gửi email thật, cấu hình `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM` trong **backend/.env** (không commit). Cổng 465 thường dùng `SMTP_SECURE=true`, cổng 587 thường dùng `false` và STARTTLS. Dịch vụ SMTP thật phải có domain/sender được xác minh bởi provider; kiểm tra DMARC/SPF/DKIM theo provider.
