# Tài khoản dùng để kiểm thử (chỉ sử dụng trên database demo)

File `database/seed_demo.sql` tạo 20 tài khoản:
- 1 Admin: `admin@talentmatch.test`
- 5 Client: `client01@talentmatch.test` đến `client05@talentmatch.test`
- 14 Freelancer: `freelancer01@talentmatch.test` đến `freelancer14@talentmatch.test`

**Mật khẩu dùng chung CHỈ cho môi trường thử nghiệm:** `Demo@2026Safe!`

Mật khẩu được lưu bằng PBKDF2-HMAC-SHA256, có salt riêng từng tài khoản. Tất cả email là tên miền `.test`, không dùng người thật. Thay đổi mật khẩu và vô hiệu hóa các tài khoản demo trước khi triển khai ra Internet. Chạy lại seed không nhân đôi bản ghi nhờ email duy nhất và `seed_key` duy nhất.
