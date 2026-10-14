# DATABASE — PostgreSQL + Prisma 6

Source gốc có migration đầu tiên `20261014000000_initial`. Bản nâng cấp **giữ nguyên** migration gốc và thêm migration tuần tự:

1. `20261014010000_email_tokens`: thêm `User.emailVerifiedAt` và bảng `EmailToken` (hash SHA256, purpose, expiry). Migration này đánh dấu tài khoản **đã tồn tại trước khi nâng cấp** là đã xác minh để không vô tình chặn tài khoản gốc; tài khoản tạo mới vẫn cần bấm link email.
2. `20261014020000_invitations_complaints`: bảng `Invitation`, `Complaint`, foreign keys, unique invitation theo `(jobId, freelancerId)` và indexes.
3. `20261014030000_oauth_linking`: cột `OAuthState.linkUserId` cho luồng liên kết sau đăng nhập.
4. `20261014040000_review_moderation`: cột `Review.hidden` để Admin ẩn/hiện đánh giá mà không xóa lịch sử.

Schema hiện có 19 model, trong đó các nhóm User/Session/OAuth, JobPost/Application/Invitation, Workspace/Milestone/Message/Transaction/Review/Complaint và Notification/Portfolio/Company/Admin Audit.

## Áp dụng không phá hủy dữ liệu

**Sao lưu trước** nếu đang dùng DB đã có thông tin quan trọng, ví dụ dùng `pg_dump` từ PostgreSQL hoặc tính năng Export/Backup công cụ quản trị DB. Trước khi chạy, đối chiếu URL trong `backend/.env` và chắc chắn đúng database mong muốn.

```powershell
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
```

Không cần `prisma db push`, `migrate reset`, `drop schema` hoặc `docker compose down -v`. Không sửa history migration cũ đã chạy.

## Seed

- 100 tài khoản demo: 2 Admin, 23 Client, 75 Freelancer; có mật khẩu băm bcrypt và `isDemo=true`.
- 36 dự án mới khi DB trống: công khai, đang làm và hoàn tất; 108 đơn ứng tuyển và 15 workspace có milestone, tin nhắn, transactions demo và đánh giá.
- Portfolio + avatar/logo/cover sinh SVG khác nhau, gắn bằng URL local. Tệp được tạo bên trong `backend/uploads/public/demo/`.
- Seed chạy lặp qua unique account email, `(jobId, freelancerId)`, `(jobId, freelancerId)` cho lời mời, `jobId` cho workspace, kiểm tra tên job/portfolio và lookup notification/complaint để giảm tạo trùng.
- Với email demo trùng tài khoản **không** được đánh dấu `isDemo`, seed dừng để tránh can thiệp tài khoản thật. Với tài khoản demo đã có, seed không ghi đè thông tin cá nhân và mật khẩu.

**Trạng thái kiểm tra:** file SQL có sẵn nhưng trong môi trường tạo source chưa có PostgreSQL để thực thi. Cần kiểm tra schema, migration, seed 2 lần trên máy có DB và đối chiếu các số lượng thực tế.
