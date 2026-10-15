# TalentMatch — Java Web / Maven (phát triển tiếp từ source nhóm trưởng)

**Source gốc:** `tmdt_ck-main2.zip` (giữ nguyên, không ghi đè). Bản bàn giao này được sửa từ thư mục `tmdt_ck/` nằm trong ZIP đó. Không chuyển sang React, Node.js hoặc PostgreSQL.

**Công nghệ:** Java 17, Jakarta Servlet 6, Maven WAR, Tomcat 10.1, MySQL 8, HTML + CSS + JavaScript thuần. Giữ `src/web`, `src/java` và style navy/tím/gradient/bo góc của nhóm trưởng.

> Trạng thái dự án: đã triển khai nền tảng các trang và luồng demo cho Guest, Freelancer, Client, Admin, API MySQL, dữ liệu mẫu và cơ chế xác thực cơ bản. **Chưa xác nhận hoạt động end-to-end trên Tomcat/MySQL trong môi trường tạo bản bàn giao.** Các tính năng dịch vụ ngoài chưa được tích hợp thật, xem `docs/TEST_REPORT.md` và `docs/FUNCTION_STATUS.md`.

## 1. Hướng dẫn chạy trên Windows (Tomcat + MySQL)

1. Cài **JDK 17**, **Maven 3.9+**, **MySQL 8.0+**, **Tomcat 10.1**. Tránh Tomcat 9 vì dự án dùng package `jakarta.servlet`.
2. Giải nén source và mở thư mục `tmdt_ck` có file `pom.xml` bằng IntelliJ IDEA hoặc IDE Java tương thích. Chọn JDK 17.
3. **Sao lưu database hiện có trước khi chạy bất kỳ script nào.** Nếu dùng database thử nghiệm mới, mở MySQL client và thực hiện:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed_demo.sql
```

4. Cấu hình MySQL qua biến môi trường (ưu tiên) hoặc `src/resources/db.properties` trong môi trường cá nhân. **Không commit mật khẩu DB thật**. Các biến môi trường:

```text
TM_DB_HOST=localhost
TM_DB_PORT=3306
TM_DB_NAME=talentmatch
TM_DB_USER=root
TM_DB_PASSWORD=<MẬT_KHẨU_MYSQL_CỦA_BẠN>
```

5. Trong thư mục dự án chạy:

```bash
mvn clean package
```

6. Nếu Maven thành công, lấy `target/talentmatch.war`, chép vào `webapps/` của Tomcat 10.1 và khởi động Tomcat. Mở:

   - Trang chủ: `http://localhost:8080/talentmatch/`
   - Đăng nhập: `http://localhost:8080/talentmatch/html/login_register.html`
   - Không gian làm việc: `http://localhost:8080/talentmatch/html/workspace.html`
   - Việc làm: `http://localhost:8080/talentmatch/html/jobs.html`

Khi sửa source, build và redeploy WAR. **Chỉ chạy một bản TalentMatch trên một context path** để tránh nhầm database hoặc phiên đăng nhập.

## 2. Tài khoản demo có sẵn trong file seed

Mật khẩu demo (chỉ dùng với database thử nghiệm): `Demo@2026Safe!`

| Vai trò | Email | Số lượng |
|---|---|---:|
| Admin | `admin@talentmatch.test` | 1 |
| Client | `client01@talentmatch.test` đến `client05@talentmatch.test` | 5 |
| Freelancer | `freelancer01@talentmatch.test` đến `freelancer14@talentmatch.test` | 14 |

Tổng **20 tài khoản**, mỗi tài khoản có salt và PBKDF2-SHA256 riêng. Có bản ghi seed cho bài đăng, proposal, lời mời, thỏa thuận, dự án, milestone, tin nhắn, theo dõi thanh toán, đánh giá và báo cáo. Email `.test` là email giả lập, **không nhận thư ngoài Internet**. Các tài khoản này không phù hợp triển khai công khai.

## 3. Cách thử từng nhóm chức năng

**Guest:** mở trang chủ → công việc → dùng bộ lọc → xem chi tiết → thử URL công việc sai ID. Trang công việc sẽ thử API công khai, và hiện nhãn dữ liệu mẫu nếu API không có.

**Freelancer:** đăng nhập `freelancer01@talentmatch.test` → workspace → hồ sơ → danh sách công việc → gửi proposal → ứng tuyển → lời mời → thỏa thuận → mốc dự án → bàn giao/chỉnh sửa → chat và báo cáo.

**Client:** đăng nhập `client01@talentmatch.test` → workspace → hồ sơ doanh nghiệp → tạo công việc → xem ứng tuyển → chọn Freelancer → gửi lời mời → thỏa thuận → tạo dự án → milestone → nghiệm thu.

**Admin:** đăng nhập `admin@talentmatch.test` → workspace → quản lý tài khoản, tin đăng, danh mục, báo cáo; thử tạm khóa tài khoản (không thể tự khóa Admin).

**Demo chỉ Frontend:** Nếu mở bằng static server hoặc không có API xác thực, workspace sẽ hiển thị nhãn `CHẾ ĐỘ DEMO · KHÔNG GHI MYSQL`, cho phép chọn vai trò để xem và sử dụng dữ liệu `localStorage`. Đây không phải xác thực hay phân quyền thật. Bản demo dùng cùng một bộ dữ liệu mẫu trong từng trình duyệt. Không dùng chế độ này làm bằng chứng bảo mật server. Để thử API thực, phải đăng nhập qua Tomcat + MySQL.

**Thử lỗi:** mật khẩu sai phải nhận HTTP 401, dữ liệu gửi không hợp lệ bị từ chối; token email/OAuth không có thì không giả vờ thành công. Đóng/mở lại workspace để xác nhận dữ liệu demo được giữ trong localStorage. Thử lọc không có kết quả và ID không hợp lệ.

## 4. Kiến trúc được giữ nguyên

```text
src/
├── java/
│   ├── controller/     # LoginController, DataController, SecurityFilter
│   ├── service/        # LoginService, WorkService
│   ├── dao/            # UserDao, RecordDao, BaseDao, DBConnection
│   ├── model/          # User, WorkRecord
│   └── util/           # PasswordHash, Json, Http, RateLimiter
├── resources/
│   └── db.properties
└── web/
    ├── html/          # các trang cũ + workspace, about
    ├── css/           # CSS gốc + workspace.css
    ├── js/            # JS gốc + workspace/site/public-data
    ├── WEB-INF/web.xml
    └── META-INF/context.xml
```

Luồng thực tế: **HTML/JS → Servlet Controller → Service → DAO → MySQL**, dùng Model để biểu diễn dữ liệu. Backend **không** lưu quyền/phiên trên localStorage: phiên Servlet dùng cookie HttpOnly, kiểm tra trạng thái user qua SecurityFilter trên từng API request. POST API dùng custom header `X-TM-Request` và kiểm tra Origin cùng nguồn. `SecurityFilter` gửi một số header bảo mật. Password không lưu plaintext.

## 5. Các điểm cần cấu hình hoặc tiếp tục triển khai

- **Email xác minh, quên mật khẩu:** Frontend có trạng thái; **chưa có mail provider và token reset**. Bản này không gửi email thật. Cần nhà cung cấp SMTP/API, địa chỉ gửi hợp lệ và cơ chế email token một lần trước khi bật xác minh bắt buộc.
- **Google/Facebook/Apple OAuth:** nút chỉ thông báo đang chờ cấu hình. Cần app/client ID, secret ở biến môi trường riêng, callback và xác minh token từ provider; không tạo session giả.
- **Thanh toán và Premium:** giao diện/theo dõi/yêu cầu quan tâm, **không chuyển tiền thật, không thu phí**. Tích hợp thanh toán yêu cầu môi trường và tài khoản merchant hợp lệ.
- **Chat:** gửi/lưu bản ghi thông qua API, chưa có websocket, luồng thời gian thực hay kiểm soát chống spam nâng cao.
- **TalentCredit:** mẫu dữ liệu và thao tác quản trị, chưa có sổ cái tài chính an toàn. Không quy đổi thành tiền.
- **CV/portfolio:** trường URL và mô tả; chưa hỗ trợ upload file và quét file.
- **Thông báo:** danh sách trạng thái; chưa có worker tự động tạo notification cho mọi hành động.
- **Nghiệp vụ dự án:** có chuyển trạng thái và quyền cơ bản, nhưng cần thêm test tích hợp, transaction đa bảng, lịch sử audit và quy trình thanh toán theo milestone trước vận hành thực tế.
- **Điều khoản & hỗ trợ:** nội dung bản đồ án, cần rà soát trước sử dụng thương mại.

## 6. Database cũ và migration

Các script không `DROP TABLE`, không xóa dữ liệu. `schema.sql` tạo bảng khi chưa có, đồng thời bổ sung cột `users.status` nếu thiếu. Nhưng vì **không có quyền kiểm tra schema MySQL thực tế của nhóm trưởng**, không thể đảm bảo schema của một database có sẵn hoàn toàn tương thích: phải sao lưu và kiểm tra `SHOW CREATE TABLE users;` trước khi chạy. Nếu bảng `users` cũ chứa mật khẩu plaintext, tài khoản cũ **không được tự động coi mật khẩu plaintext là hợp lệ**. Cần quá trình reset/di trú mật khẩu an toàn riêng; không sửa trực tiếp thành hash demo.

`seed_demo.sql` dùng email duy nhất và `records.seed_key` duy nhất để chạy lại không tạo bản ghi trùng. Chạy file seed chỉ trong môi trường demo. Nếu database có tài khoản trùng email, seed **không ghi đè** mật khẩu hoặc vai trò cũ.

## 7. Kiểm thử

- Source Java đã biên dịch offline bằng `javac --release 17` kết hợp **stub Servlet API tạm thời đặt ngoài source**. Đây **không phải** xác nhận build Maven/Tomcat thành công.
- Bài thử Java: `tests/JavaCoreTest.java`, `tests/WorkServiceTest.java`, `tests/controller/ApiSmokeTest.java`.
- Bài thử Node: `tests/frontend_data_test.js`; tĩnh: `tests/browser_static_test.py`.
- Thực hiện bằng Maven thật trên máy bạn: `mvn clean package` và chạy `tests/run-unit-tests.sh` trên Bash (hoặc lệnh tương đương trên Windows), xem báo cáo `docs/TEST_REPORT.md`.

## 8. File báo cáo

- `docs/INVENTORY.md`: kiểm kê source gốc.
- `docs/CHANGELOG.md`: danh sách file sửa/tạo và lý do.
- `docs/FUNCTION_STATUS.md`: ma trận chức năng; phân biệt demo, API đã viết và dịch vụ còn thiếu.
- `docs/TEST_REPORT.md`: kết quả đã chạy và chưa chạy.

**Lưu ý:** Source được chuẩn bị để tiếp tục triển khai trên Tomcat. Không nên dùng hệ thống quản lý thanh toán, tranh chấp hoặc thông tin cá nhân thực khi chưa kiểm thử end-to-end và rà soát bảo mật.

## Cập nhật UX Workspace — 2026-10-15

Source này tiếp tục từ `TalentMatch_JavaWeb_Full_Source(1).zip`; vẫn giữ Java Web/Servlet/Maven/MySQL và CSS nhận diện navy–tím. Không thay đổi database hoặc đường dẫn API.

- **Freelancer:** Tổng quan có tìm công việc, cơ hội, nhiệm vụ và dự án. Sidebar được gộp **Kết nối & thỏa thuận / Quản lý dự án / Hỗ trợ & tranh chấp**; hồ sơ/CV, thông báo, TalentCredit và Premium chuyển lên header.
- **Client:** Tổng quan có tìm Freelancer, đề xuất, lời mời và các milestone cần nghiệm thu; sidebar nhóm tương tự và giữ đăng tuyển/tranh chấp.
- **Admin:** Dashboard giám sát riêng và 9 nhóm chức năng trong sidebar, không được thay bên tham gia xác nhận thỏa thuận/dự án/milestone.
- **Header công khai:** không còn banner ngang "DỮ LIỆU MẪU". Dữ liệu không có API vẫn hiển thị ghi chú minh họa ngay tại khu vực danh sách; không coi đó là MySQL thật.
- Mobile 390px/tablet 768px: menu chức năng dạng drawer. Các mục con nằm ở tabs; menu avatar/chuông đóng khi nhấn ra ngoài hoặc Escape.

**Tài liệu thay đổi và kiểm thử:** `docs/UX_REDESIGN_REPORT.md` (đọc trước khi nghiệm thu), ảnh chụp tại `docs/screenshots/`.

**Lệnh kiểm thử bổ sung (tùy chọn):** `python tests/workspace_ux_browser_test.py` và `python tests/public_header_ux_test.py` sau khi cài Playwright và Chromium (kiểm tra DOM có browser, không cần MySQL). Nếu dùng Chromium hệ thống ngoài tên thông dụng, cấu hình `TM_CHROMIUM_PATH`. Java tests và kiểm tra tĩnh còn ở `tests/`.

**Trạng thái triển khai:** Logic Java core đã biên dịch bằng `javac --release 17`; 35 Java assertions, 42 Chromium workspace assertions và 6 public-header assertions đạt. Môi trường tạo bản này **không có Maven, Tomcat hay MySQL**, nên chưa thể xác minh `mvn clean package` và E2E trên bản mới. Chạy lệnh build/deploy và kiểm thử hai phiên người dùng trên máy chủ dự án để nghiệm thu.

## Bàn giao UI/UX chuẩn hóa (15/10/2026)

Bản này tiếp tục từ `TalentMatch_JavaWeb_UX_2026_10_15(1).zip`, chỉ chỉnh các thành phần HTML/CSS/JavaScript cho Freelancer, Client và Admin; **Java, Maven, API, database, seed và Servlet session giữ nguyên**. Header sticky, sidebar điều hướng theo nhóm, avatar, tabs, filter và responsive đã được chuẩn hóa.

- Báo cáo thay đổi, giới hạn và kiểm thử: [`docs/UI_STANDARDIZATION_REPORT.md`](docs/UI_STANDARDIZATION_REPORT.md).
- Danh sách 52 view theo vai trò: [`docs/UI_VIEW_AUDIT.md`](docs/UI_VIEW_AUDIT.md).
- Thử Chromium DOM, không cần Tomcat: `python3 tests/all_views_ui_regression.py` và `python3 tests/public_pages_layout_test.py` (cần Python Playwright + Chromium).
- Build triển khai trên máy có Maven: `mvn clean package`. Môi trường tạo bản này **không có lệnh mvn**, nên chưa xác nhận WAR mới hoặc tích hợp Tomcat/MySQL.
