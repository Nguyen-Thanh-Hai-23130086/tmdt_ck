# Kiểm kê source gốc từ `tmdt_ck-main2.zip`

Gốc `tmdt_ck-main (1)/tmdt_ck-main/tmdt_ck/` chứa Maven WAR project (`pom.xml`), `src/java/controller/LoginController.java`, `controller/TestLogin.java`, `dao/BaseDao.java`, `dao/DBConnection.java`, `dao/UserDao.java`, `model/User.java`, `service/LoginService.java`, `src/resources/db.properties`, 7 trang HTML trong `src/web/html`, 2 file CSS, 2 file JavaScript, `src/web/WEB-INF/web.xml` và thư mục build `target/`. **Không có script schema/seed chuẩn trong ZIP gốc.**

Các trang gốc: `home.html`, `jobs.html`, `job-detail.html`, `candidates.html`, `candidate-detail.html`, `profile.html`, `login_register.html`. Các trang chi tiết hiển thị đối tượng đầu tiên khi ID không hợp lệ; nhiều đường dẫn đăng nhập tới `login.html` không tồn tại. JavaScript có mảng dữ liệu mẫu và nhiều chuỗi bị mojibake tiếng Việt. `login_register.js` chỉ chuyển kiểu bố cục, chưa có đăng ký, OAuth, email reset thực tế. `LoginController` gọi trực tiếp DAO, bỏ qua Service và so sánh password plaintext.

Ảnh đăng nhập gốc thể hiện font Arial, navy `#15224f`, tím `#6538ed`, tím sáng `#895df7`, nền trắng/xám, gradient nút, input viền nhạt và khối bo góc. File CSS gốc được giữ lại, chỉ có CSS bổ sung cho những trạng thái/trang mới.

**Không lấy source Node.js/React khác làm nền.** Thư mục source hiện tại là bản sao được mở rộng của nhóm trưởng.
