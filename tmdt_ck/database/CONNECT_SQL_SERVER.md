# TalentMatch trên SQL Server

## Kết nối cục bộ

Ứng dụng dùng database riêng `TalentMatch` trên SQL Server tại `localhost,1433`. Không dùng database bán đồ ăn `TruyenThongDTB`.

1. Mở SQL Server Management Studio, kết nối instance `localhost,1433` bằng Windows Authentication.
2. Mở và chạy `database/sqlserver_talentmatch.sql`. Script chỉ tạo database và bảng còn thiếu; không xóa database/bảng hiện có.
3. Ứng dụng dùng SQL login riêng `talentmatch_app`, không dùng tài khoản `sa`. Mật khẩu kết nối được đặt ở biến môi trường Windows `TM_DB_PASSWORD`; các biến `TM_DB_SERVER`, `TM_DB_NAME`, `TM_DB_USER` cũng được hỗ trợ. Trên máy đã cấu hình, mật khẩu `sa` mới được lưu riêng trong biến `TM_SA_PASSWORD`.
4. Đóng và mở lại IntelliJ/terminal sau khi cấu hình biến môi trường để Java nhận cấu hình mới.

Giá trị mặc định trong `src/resources/db.properties` trỏ tới `localhost:1433` / `TalentMatch`. Không ghi mật khẩu thật vào file này.

Microsoft JDBC Driver được Maven khai báo trong `pom.xml`. Chuỗi kết nối bật TLS và chấp nhận chứng chỉ cục bộ tự ký; khi triển khai máy chủ thật, thay bằng chứng chỉ được tin cậy.

## Tài khoản demo

Schema không xóa hay ghi đè tài khoản. Nạp 20 tài khoản demo bằng `database/sqlserver_seed_users.sql`; mật khẩu chung là `Demo@2026Safe!`. File `database/seed_demo.sql` hiện là cú pháp MySQL và không chạy trực tiếp trên SQL Server.

Để xem mật khẩu `sa` đã tạo trên máy hiện tại, chạy trong PowerShell:

```powershell
[Environment]::GetEnvironmentVariable('TM_SA_PASSWORD', 'User')
```

Mật khẩu SQL login mà Java dùng được lưu trong `TM_DB_PASSWORD`:

```powershell
[Environment]::GetEnvironmentVariable('TM_DB_PASSWORD', 'User')
```
