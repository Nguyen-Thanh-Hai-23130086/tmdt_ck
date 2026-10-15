# Danh sách thay đổi so với ZIP gốc nhóm trưởng

**Giữ nguyên:** `pom.xml`, `dao/BaseDao.java`, `controller/TestLogin.java`, `src/resources/db.properties` và bố cục/thành phần nhận diện trong CSS gốc. `tmdt_ck-main2.zip` không bị chỉnh sửa.

## Tạo mới

- `src/java/controller/DataController.java`: API dữ liệu, hồ sơ, CRUD.
- `src/java/controller/SecurityFilter.java`: kiểm tra trạng thái user, các header bảo mật.
- `src/java/dao/RecordDao.java`: truy cập dữ liệu nghiệp vụ MySQL theo kind, `PreparedStatement`.
- `src/java/model/WorkRecord.java`: model dữ liệu nghiệp vụ.
- `src/java/service/WorkService.java`: kiểm tra quyền, luồng ứng tuyển, lời mời, dự án, milestone, thỏa thuận.
- `src/java/util/{PasswordHash,Json,Http,RateLimiter}.java`: hỗ trợ mật khẩu PBKDF2, JSON, HTTP, giới hạn đăng nhập.
- `src/web/html/workspace.html`, `src/web/css/workspace.css`, `src/web/js/workspace.js`: giao diện theo vai trò, dữ liệu demo và API.
- `src/web/html/about.html`: thông tin/điều khoản và hỗ trợ mẫu.
- `src/web/js/public-data.js`: thử API công khai trước khi dùng dữ liệu mẫu.
- `src/web/js/site.js`: trạng thái đăng nhập trên header, logout, nút tìm kiếm và newsletter demo.
- `src/web/META-INF/context.xml`: SameSite Lax trên Tomcat.
- `database/schema.sql`, `database/seed_demo.sql`, `DEMO_ACCOUNTS.md`: schema không DROP và 20 tài khoản demo.
- `README.md`, `docs/*.md`: cài đặt, kiến trúc, ma trận chức năng, báo cáo.
- `tests/*`: các bài kiểm tra Java, Node và cấu trúc HTML/JS.

## Chỉnh sửa

- `src/java/controller/LoginController.java`: Controller → Service, register/login/logout, HTTP status JSON, session.
- `src/java/service/LoginService.java`: PBKDF2, chính sách mật khẩu, kiểm tra trạng thái.
- `src/java/dao/UserDao.java`: CRUD người dùng/hồ sơ, truy vấn danh sách Freelancer, admin account status.
- `src/java/dao/DBConnection.java`: ưu tiên biến môi trường, MySQL JDBC.
- `src/java/model/User.java`: thêm status, Serializable phục vụ session.
- `src/web/html/login_register.html`, `src/web/css/login_register.css`, `src/web/js/login_register.js`: đăng nhập/đăng ký/forgot/verify/reset states, giữ thiết kế gốc.
- `src/web/html/{home,jobs,job-detail,candidates,candidate-detail,profile}.html`: sửa URL, menu, placeholder, mã hóa tiếng Việt.
- `src/web/js/talentmatch.js`: sửa mojibake, xử lý ID không tìm thấy, chuyển nút ứng tuyển/mời sang form, escape XSS, lưu hồ sơ demo.
- `src/web/css/talentmatch.css`: thêm kiểu login shortcut mà không thay hệ thống màu.
- `src/web/WEB-INF/web.xml`: cài đặt cookie HttpOnly và session 30 phút.
- `src/web/index.html`: chuyển về trang chủ thực tế.

## Lỗi đã xác định/đã sửa trong code

- Các route `login.html` không tồn tại.
- Chức năng đăng nhập so sánh mật khẩu plaintext, bypass `LoginService`.
- Chi tiết `id` không tồn tại nhưng lại hiển thị bản ghi đầu tiên.
- Các nút `apply/invite` trước đây chỉ thông báo thành công giả.
- Nhiều đoạn nội dung tiếng Việt bị mã hóa sai.
- Guest nhìn thấy avatar và tên người dùng minh họa như đã đăng nhập.
- Thiếu trạng thái nhập liệu, tìm kiếm không có kết quả, hỗ trợ đa vai trò và phân trang.
- Thiếu mô hình dữ liệu và kiểm tra quyền server cho các luồng mới.

**Không tạo migration ghi đè dữ liệu thật:** `schema.sql` chỉ tạo bảng nếu chưa có và bổ sung cột cần thiết có kiểm tra; cần so sánh database thực tế trước khi chạy.

## Đợt UX Workspace — 2026-10-15

Chi tiết từng file và lý do: xem **`docs/UX_REDESIGN_REPORT.md`**. Đợt này thay đổi shell workspace, dashboard và menu nhóm chức năng ba vai trò; bỏ banner demo công khai; đồng bộ avatar header công khai; hỗ trợ từ khóa từ dashboard tới trang kết quả; siết quyền chuyển trạng thái dự án tại Service. **Không thay đổi database schema, seed, pom.xml, controller hay DAO.**

## 2026-10-15 — Chuẩn hóa UI/UX ba vai trò (đợt tiếp theo)

Chuẩn hóa header cố định, sidebar nhóm, menu avatar, tiêu đề, tab, bộ lọc, thẻ, biểu mẫu và responsive trong `workspace.html`, `workspace.js`, `workspace.css`, `talentmatch.css`. Không thay Java/API/DB/seed. Xem `docs/UI_STANDARDIZATION_REPORT.md` và `docs/UI_VIEW_AUDIT.md`.
