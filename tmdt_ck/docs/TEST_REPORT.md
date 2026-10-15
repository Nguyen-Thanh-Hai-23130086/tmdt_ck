# Báo cáo kiểm thử thực tế — TalentMatch Java Web

## Đã thực sự chạy trong môi trường tạo source

| Kiểm tra | Phương thức | Kết quả |
|---|---|---|
| Java core: hash, xác thực email/mật khẩu, tài khoản khóa, JSON, hash seed Python/Java | `javac --release 17` + `java JavaCoreTest` | **12 PASS, 0 FAIL** |
| Quy tắc Service: phân vai, proposal, lời mời, ứng tuyển, milestone, thỏa thuận hai chữ ký | `java WorkServiceTest` (DAO giả trong bộ test) | **19 PASS, 0 FAIL** |
| HTTP Controller với request/response mô phỏng, CSRF, phân quyền, giới hạn yêu cầu | `java controller.ApiSmokeTest` | **10 PASS, 0 FAIL** |
| Dữ liệu và cấu hình Frontend JavaScript | `node tests/frontend_data_test.js` | **12 PASS, 0 FAIL** |
| Cú pháp JS, tài nguyên HTML/CSS, đường dẫn `.html`, trạng thái ID không hợp lệ | `python tests/browser_static_test.py` | **PASS** |
| Seed: 20 tài khoản, email/role duy nhất, PBKDF2, dữ liệu liên kết | `python tests/seed_integrity_test.py` | **PASS** |

**Tổng:** 53 phép kiểm tra Java/Node đạt, 1 nhóm kiểm tra tĩnh và 1 nhóm kiểm tra seed đạt. Mã Java được biên dịch bằng JDK 21 nhưng **target bytecode Java 17**. Vì không có Maven và Servlet API thực được tải trong môi trường này, bài test dùng các Java stub tối thiểu **ngoài source** để biên dịch thử chữ ký Servlet. Không dùng stub làm runtime hoặc đóng gói giao cho người dùng.

## Đã thử nhưng bị giới hạn

- Kiểm thử Chromium/Playwright ở viewport desktop/tablet/mobile: chính sách trình duyệt trong môi trường chặn cả điều hướng `http://localhost` và `file://` bằng `ERR_BLOCKED_BY_ADMINISTRATOR`, nên **chưa có kết quả kiểm thử tương tác/ảnh chụp thật**.
- `mvn clean package`: Maven không có trong môi trường, không tải được dependency từ Maven Central (DNS không truy cập được). **Chưa build WAR bằng Maven thực**.
- MySQL, Tomcat: không có dịch vụ tương ứng đang chạy; không thể import seed, kiểm thử migration hay API có kết nối DB. **Chưa chạy integration test**.
- SMTP, Google/Facebook/Apple, thanh toán: thiếu tài khoản cấu hình/secret và chưa triển khai server-side; **chưa kiểm thử dịch vụ thật**.

## Cách tái kiểm thử sau khi giải nén

1. `mvn clean package` với JDK 17 và mạng cho phép tải Maven dependency.
2. Import `database/schema.sql` và `database/seed_demo.sql` vào MySQL demo.
3. Triển khai WAR lên Tomcat 10.1 và đăng nhập theo `DEMO_ACCOUNTS.md`.
4. Kiểm thử giao diện bằng DevTools trên desktop 1440px, tablet 768px, mobile 390px; quan sát không tràn ngang, console không lỗi, mọi nút có phản hồi.
5. Thử user không hợp lệ, mật khẩu sai, account suspended, quyền Client/Freelancer/Admin, cập nhật dự án giữa hai tài khoản.
6. Xác nhận riêng rằng các nút Google/Facebook/Apple, email và thanh toán không đưa ra thông báo thành công giả.

## Lỗi/chưa thể kết luận

- Không có chứng cứ Maven WAR/Tomcat/MySQL chạy end-to-end trong môi trường này.
- Cần kiểm tra thực tế schema DB trước khi import, vì bảng `users` cũ có thể không giống schema baseline.
- Một số trang nội dung phụ (hợp đồng pháp lý, chính sách) vẫn là mẫu và cần chủ dự án duyệt.
- Chưa có test E2E trình duyệt và test tải/concurrency/độ bền dữ liệu cho các chức năng nghiệp vụ.

## Đợt UX — kiểm thử bổ sung 2026-10-15

- `javac --release 17` cho lõi Model/DAO/Service: PASS.
- `JavaCoreTest`: 12 PASS; `WorkServiceTest`: 23 PASS (bao gồm 4 kiểm tra quyền dự án mới).
- `tests/workspace_ux_browser_test.py`: 42 PASS trong Chromium, dùng `set_content` vì HTTP localhost bị policy môi trường chặn; 3 vai trò ở 1440/768/390, không tương đương E2E.
- Frontend data JS 12 PASS, kiểm tra tĩnh HTML/cú pháp và seed tĩnh PASS.
- `mvn clean package`: đã gọi thử nhưng `mvn: command not found`; không được đánh dấu PASS. Không có Tomcat/MySQL chạy để kiểm thử end-to-end.
- Xem thêm `docs/UX_REDESIGN_REPORT.md` để biết test scope, screenshot và lỗi còn tồn tại.

- `tests/public_header_ux_test.py`: 6 Chromium DOM assertions PASS cho header khách và tài khoản mock, không dùng API thật.

## Kiểm thử bổ sung — Chuẩn hóa UI/UX (15/10/2026)

- Chromium `tests/all_views_ui_regression.py`: **871 phép kiểm tra/đo lường PASS** (52 view x 5 kích thước, cộng kiểm tra click nhóm/tab/menu), DOM riêng biệt không qua HTTP.
- Chromium `tests/public_pages_layout_test.py`: **70 phép đo PASS** (7 trang x 5 kích thước), DOM riêng biệt.
- Chromium test workspace cũ điều chỉnh theo nhóm mới: **42 PASS**. Public header DOM: **6 PASS**.
- JS data tests: **12 PASS**, static HTML: PASS, seed integrity: PASS, `node --check`: PASS.
- Java core/unit logic biên dịch `javac --release 17`: **12 + 23 PASS** (không dùng database thật).
- `mvn clean package`: **KHÔNG CHẠY** (`mvn: command not found`). Tomcat/MySQL: **CHƯA KIỂM THỬ**.
- Chi tiết, rủi ro và quy trình nghiệm thu: `docs/UI_STANDARDIZATION_REPORT.md`.
