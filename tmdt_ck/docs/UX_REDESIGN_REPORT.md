# TalentMatch — Báo cáo tổ chức lại UX (bàn giao giao diện 2026-10-15)

## 1. Nguồn và phạm vi

**Đầu vào:** `TalentMatch_JavaWeb_Full_Source(1).zip`, thư mục dự án `tmdt_ck` (54 file). Bản chỉnh sửa tiếp tục từ chính source này, **không tạo dự án mới**; source đầu vào giữ nguyên. Java 17, Jakarta Servlet 6, Maven WAR, Tomcat 10.1, MySQL 8, HTML/CSS/JS thuần không đổi. Không thay đổi `pom.xml`, bảng MySQL, dữ liệu seed, API path hay servlet session.

**Mục tiêu đợt này:** Tổ chức lại Frontend của Freelancer, Client và Admin, giữ chức năng sẵn có; không bổ sung thanh toán thật, OAuth, mail provider hay cơ chế realtime.

## 2. Thiết kế và luồng mới

| Khu vực | Triển khai | Dữ liệu/giới hạn |
|---|---|---|
| Header công khai | Không còn dải `DỮ LIỆU MẪU` chèn dưới header; avatar công khai phản hồi khi nhấn, đóng khi nhấn ngoài/Escape; đăng xuất gọi Servlet. | Gắn nhãn nguồn dữ liệu nhỏ cạnh danh sách; khi không có API dùng dữ liệu demo. |
| Header workspace | Logo, điều hướng công khai, chuông thông báo, avatar menu và (Freelancer/Client) TalentCredit/Premium. | Avatar lấy từ `GET /api/auth/me` khi đăng nhập thật; demo ghi rõ chưa đăng nhập. |
| Freelancer | Dashboard: tìm việc, 4 chỉ số tính trên dữ liệu khả dụng, việc cần xử lý, cơ hội, dự án; sidebar **Tổng quan / Kết nối & thỏa thuận / Quản lý dự án / Hỗ trợ & tranh chấp**. | Tìm kiếm chuyển đến `jobs.html?q=`; gợi ý dựa trên kỹ năng nếu profile demo có dữ liệu, **không phải AI**. |
| Client | Dashboard: tìm Freelancer, chỉ số bài đăng/proposal/lời mời/dự án, việc xử lý, Freelancer và dự án; sidebar ngắn. | Tìm kiếm chuyển đến `candidates.html?q=`; các kết quả demo hoặc MySQL theo cơ chế cũ. |
| Admin | Dashboard riêng: tài khoản, vai trò, báo cáo, hàng đợi xử lý, hoạt động; 9 nhóm điều hướng. | Không tự tạo số liệu kiểm duyệt chưa có bảng hỗ trợ. |
| Nhóm Kết nối & thỏa thuận | Tab ứng tuyển/proposal, lời mời, thỏa thuận theo vai trò; giữ các hành động và trạng thái cũ. | API CRUD/transition giữ nguyên đường dẫn. |
| Nhóm Quản lý dự án | Tab dự án, milestone, tin nhắn, thanh toán, đánh giá; mở milestone của dự án đang chọn. | Chỉ milestone được lọc chính xác theo `projectId`. Tin nhắn và thanh toán còn là danh sách chung do dữ liệu hiện tại không đảm bảo liên kết dự án tương ứng. |
| Tài khoản | Avatar menu mở hồ sơ, CV/portfolio URL, trang cài đặt thông tin và đăng xuất. | Chưa có API đổi mật khẩu và upload file. Không hiển thị biểu mẫu đổi mật khẩu giả. |
| Thông báo | Chuông mở bản ghi, dấu chưa đọc dựa trên dữ liệu, truy cập danh sách để đánh dấu đã đọc. | Không có realtime và không sinh thông báo tự động cho mọi nghiệp vụ. |
| Responsive | Drawer sidebar trên tablet/mobile; tab ngang khi chật; desktop 1440, tablet 768, mobile 390. | Kiểm tra trong Chromium với nội dung được inject vào trang thử nghiệm, **không phải Tomcat E2E**. |

Đã giữ các luồng gửi proposal, tiếp nhận/thu hồi lời mời, hai phía xác nhận thỏa thuận, tạo/quản lý dự án, bàn giao/chỉnh sửa/duyệt milestone, chat dạng bản ghi, giao dịch theo dõi, đánh giá, report và quản trị tài khoản. Tất cả các chức năng chưa kết nối dịch vụ bên ngoài vẫn được coi là demo/chờ tích hợp.

### Thay đổi quyền tối thiểu tại Backend

`src/java/service/WorkService.java`: chuyển dự án từ `IN_PROGRESS` sang `REVIEW` chỉ cho Freelancer là người tham gia phía nhận dự án; Client hoàn tất dự án khi đang `REVIEW`. Admin không thể sửa/xác nhận bản ghi thỏa thuận, dự án hay milestone thay hai bên, dù có thể đọc các bản ghi quản trị. Bổ sung kiểm tra hồi quy ở `tests/WorkServiceTest.java`.

## 3. File sửa và lý do

| File | Lý do |
|---|---|
| `src/web/html/workspace.html` | Header mới, chuông, avatar, truy cập nhanh và menu mobile, giữ vùng nội dung hiện có. |
| `src/web/css/workspace.css` | Hệ thống layout dashboard, tabs, cards, menu/popup/drawer dùng màu navy/tím của source. |
| `src/web/js/workspace.js` | Nav nhóm theo vai trò, dashboard dùng dữ liệu, điều hướng và tương tác; giữ CRUD/transition hiện có. |
| `src/web/js/talentmatch.js` | Nhận query `q` từ tìm kiếm dashboard vào danh sách việc làm/Freelancer, tìm được cả kỹ năng. |
| `src/web/js/public-data.js` | Bỏ banner demo trên header, chuyển sang thông tin nguồn dữ liệu tại danh sách. |
| `src/web/js/site.js` | Click/Escape/outside menu avatar công khai, danh tính theo session và logout qua API. |
| `src/web/css/talentmatch.css` | CSS tối thiểu cho nhãn nguồn dữ liệu nhỏ ở danh sách. |
| `src/web/html/home.html`, `jobs.html`, `job-detail.html`, `candidates.html`, `candidate-detail.html`, `profile.html` | Bỏ tên avatar giả trên header, thêm trạng thái menu và thuộc tính logout cho header công khai. |
| `src/java/service/WorkService.java` | Ngăn thay đổi trạng thái dự án/thỏa thuận thay người tham gia. |
| `tests/WorkServiceTest.java` | Kiểm thử phân quyền chuyển trạng thái dự án. |

**Tạo mới:** `tests/workspace_ux_browser_test.py`, `tests/public_header_ux_test.py`, `docs/UX_REDESIGN_REPORT.md`, ba ảnh ở `docs/screenshots/` (chụp thử giao diện Chromium; không phải Tomcat/MySQL). Cập nhật thêm `README.md`, `docs/CHANGELOG.md`, `docs/FUNCTION_STATUS.md`, `docs/TEST_REPORT.md`.

**Không thay đổi:** `database/schema.sql`, `database/seed_demo.sql` (20 tài khoản mẫu 1 Admin, 5 Client, 14 Freelancer), `pom.xml`, controller/DAO, các Java model, API endpoint, file `db.properties`.

## 4. Kết quả kiểm thử thực tế

| Kiểm tra | Kết quả | Mức độ bằng chứng |
|---|---|---|
| `javac --release 17` cho tầng Model/DAO/Service và util lõi | PASS | Biên dịch offline, không phải Maven WAR |
| `JavaCoreTest` | 12 PASS | Logic mật khẩu/login giả lập DAO |
| `WorkServiceTest` | 23 PASS | Service DAO giả, bao gồm quyền Client/Freelancer/Admin |
| `node tests/frontend_data_test.js` | 12 PASS | JS/dữ liệu ở cấp mã nguồn |
| `python tests/browser_static_test.py` | PASS | Liên kết/tài nguyên HTML và các kiểm tra nguồn |
| `python tests/seed_integrity_test.py` | PASS | Dữ liệu seed được kiểm tra tĩnh, **chưa import MySQL** |
| `python tests/workspace_ux_browser_test.py` | 42 assertions PASS | Chromium thực nhưng dùng `set_content` (giao diện DOM độc lập); ba vai trò ở 1440/768/390, không phải HTTP navigation |
| `python tests/public_header_ux_test.py` | 6 assertions PASS | Chromium DOM công khai với API phiên giả lập; không phải HTTP E2E |
| `node --check` trên JS đã sửa | PASS | Cú pháp JavaScript |
| `mvn clean package` | **KHÔNG THỰC HIỆN ĐƯỢC** | Máy này không có `mvn`, Maven Central không phân giải DNS |
| Tomcat/MySQL E2E | **CHƯA KIỂM THỬ** | Không có môi trường Tomcat/MySQL sẵn sàng |
| Trình duyệt mở HTTP localhost | **BỊ CHẶN** | Chromium trả về `ERR_BLOCKED_BY_ADMINISTRATOR` khi `page.goto` HTTP localhost; dùng DOM isolated để kiểm tra layout và thao tác |

Ảnh chụp kiểm tra có tại `docs/screenshots/freelancer_1440.png`, `client_768.png`, `admin_390.png`.

## 5. Vấn đề còn tồn tại, chưa được tuyên bố hoàn thành

- **Chưa xác nhận build Maven WAR và chạy Tomcat/MySQL trên bản chỉnh sửa này.** Cần chạy trên môi trường máy của chủ dự án; trước đó người dùng cho biết bản ZIP đầu vào build thành công.
- Chưa kiểm thử API với database thật qua hai phiên Client/Freelancer độc lập; mới kiểm tra Service bằng DAO giả.
- Chưa thể kiểm chứng điều hướng HTTP giữa các trang, network tab và browser console khi chạy trên Tomcat thật. Bản test Chromium kiểm tra DOM và tương tác phần lớn UI, không bao gồm network.
- Các bản ghi `messages`/`payments` chưa có quan hệ `projectId` đầy đủ để bảo đảm bộ lọc chính xác theo dự án; không tự thay schema.
- Email reset/xác minh thật, Google/Facebook/Apple OAuth, thanh toán thật/Premium, realtime chat, ledger TalentCredit và file upload chưa được tích hợp thêm trong đợt UX.
- Các biểu mẫu và nút CRUD/transition đã được giữ, nhưng chưa thể tuyên bố mọi nghiệp vụ end-to-end thành công trước khi kiểm thử với DB thật.

## 6. Kiểm tra trên máy Windows của chủ dự án

1. Sao lưu DB trước khi thử; không chạy lại seed vào DB sản xuất.
2. Mở thư mục `tmdt_ck` có `pom.xml`; JDK 17, Maven 3.9+, Tomcat 10.1, MySQL 8; cấu hình biến môi trường DB theo README.
3. Chạy `mvn clean package`; copy `target/talentmatch.war` lên Tomcat và mở `/talentmatch/html/workspace.html`.
4. Đăng nhập `freelancer01@talentmatch.test`, `client01@talentmatch.test`, `admin@talentmatch.test` trong **database demo riêng**; thử menu/avatar/chuông và tab theo từng vai trò.
5. Xem ở 1440/768/390px, thử tìm kiếm dashboard và mở trang kết quả `q=`.
6. Dùng Client đăng tin, Freelancer ứng tuyển, Client chấp nhận, hai bên xác nhận thỏa thuận, bàn giao milestone và nghiệm thu. Thử quyền từ chối (Admin không ký thay, Freelancer không nghiệm thu thay Client, Client không gửi REVIEW thay Freelancer).
7. Kiểm tra Network, Console và các lỗi DB thực tế trước nghiệm thu.

**Kết luận:** Đợt thiết kế/điều hướng đã được triển khai trong source và kiểm tra DOM, core Java offline thành công. Trạng thái **chưa phải nghiệm thu tích hợp Tomcat/MySQL**.
