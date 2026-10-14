# DEMO ACCOUNTS — chỉ local

Seed khi DB trống tạo **2 Admin, 23 Client, 75 Freelancer**. Toàn bộ tài khoản demo được gắn `isDemo=true` và có `emailVerifiedAt` để phục vụ trình diễn.

| Role | Ví dụ email | Mật khẩu cho DB trống |
|---|---|---|
| Admin | admin@talentmatch.local | AdminDemo!2026 |
| Admin | admin2@talentmatch.local | AdminDemo!2026 |
| Client | client@talentmatch.local | ClientDemo!2026 |
| Client | client02@talentmatch.local ... client23@talentmatch.local | ClientDemo!2026 |
| Freelancer | freelancer@talentmatch.local | FreelancerDemo!2026 |
| Freelancer | designer@talentmatch.local | FreelancerDemo!2026 |
| Freelancer | freelancer03@talentmatch.local ... freelancer75@talentmatch.local | FreelancerDemo!2026 |

**Lưu ý backward compatibility:** nếu đã seed bản MVP cũ, `designer@talentmatch.local` vẫn dùng `DesignerDemo!2026` (mật khẩu ban đầu) vì seed không ghi đè. Các tài khoản mới không cần email xác minh thủ công vì đã được đánh dấu demo và chỉ dành cho môi trường development.

Khuyến nghị demo: đăng nhập Client đăng dự án; Freelancer gửi đơn; Client chấp nhận và tạo milestone; Freelancer bàn giao; Client nghiệm thu; Admin xử lý khiếu nại. Dữ liệu sinh 100 user, 36 job, 15 workspace và ảnh vector để sẵn sau khi seed thành công.

**Không dùng mật khẩu demo hoặc bật seed ở production.**
