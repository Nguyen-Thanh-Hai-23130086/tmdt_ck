# Trạng thái chức năng và mức độ kiểm chứng

| Nhóm | Đã triển khai trong source | Trạng thái xác minh |
|---|---|---|
| Guest | Trang chủ, tìm kiếm/lọc, danh sách, chi tiết công việc và Freelancer; liên kết đăng nhập; nhãn dữ liệu mẫu/MySQL | Kiểm tra tĩnh/JS, **chưa chạy browser E2E** |
| Đăng ký/đăng nhập/đăng xuất | Servlet session, PBKDF2, vai trò, kiểm tra người dùng ACTIVE, rate limiting, Origin/custom header | Unit và HTTP controller mock đạt; **chưa đăng nhập trên MySQL thật** |
| Quên mật khẩu, xác minh email | Màn hình và thông báo trạng thái chờ | **Chưa có token/reset SMTP/API**, không gửi thư |
| Google/Facebook/Apple | Nút và phản hồi cần cấu hình | **Chưa tích hợp OAuth** |
| Freelancer | Dashboard, hồ sơ, CV/portfolio URL, jobs, proposal, ứng tuyển, lời mời, thỏa thuận, dự án, milestone, bàn giao/chỉnh sửa, tin nhắn, đánh giá, Premium, báo cáo | Demo trong localStorage + API CRUD/transition; unit kiểm tra logic; chưa E2E |
| Client | Dashboard, doanh nghiệp, đăng tuyển, quản lý proposal, mời Freelancer, thỏa thuận, quản lý dự án, nghiệm thu, theo dõi thanh toán | Demo + API CRUD/transition; chưa E2E |
| Admin | Tổng quan, người dùng, công việc, dự án, ứng tuyển, danh mục, giao dịch, đánh giá, credits, báo cáo, Premium, chính sách | Demo + API; kiểm tra hạn chế vai trò, chưa E2E |
| Tìm kiếm/lọc/phân trang | Giao diện dữ liệu và thao tác | Node data test/tĩnh; kiểm thử tương tác trình duyệt còn thiếu |
| Trạng thái và thỏa thuận | Đơn ứng tuyển, lời mời, hai chữ ký thỏa thuận, milestone từ TODO → IN_PROGRESS → SUBMITTED/REVISION/ACCEPTED | WorkService unit tests; chưa thử database |
| Chat | Tin nhắn ghi thành record `messages` | API lập trình; chưa real-time/WebSocket |
| Thanh toán | Theo dõi và hiển thị bản ghi mẫu | Không có thanh toán thật/merchant/webhook |
| TalentCredit | Danh sách và quản lý record cơ bản | Chưa có sổ cái/đổi điểm thực tế |
| Premium | Danh sách gói, gửi yêu cầu quan tâm | Không thu phí, không kích hoạt quyền Premium thương mại |
| Thông báo | Màn hình và trạng thái đã đọc | Chưa có worker gửi tạo tự động |
| Database | Schema + seed 1 Admin / 5 Client / 14 Freelancer, dữ liệu liên kết | Đã kiểm tra hash cross-language; **chưa import vào MySQL** |
| Build và chạy Tomcat | Cấu trúc WAR Maven, annotation, web.xml/context.xml | Offline `javac --release 17` đạt; **chưa chạy Maven/Tomcat** |

**Các giới hạn nghiệp vụ:** Hệ thống đã có UI và các API CRUD tổng quát cho luồng chính, nhưng chưa phải bản SaaS sẵn sàng sản xuất. Cần thêm kiểm thử thật, xử lý transaction đa bước, chống spam nâng cao, audit log, file upload an toàn, email, OAuth và payment integration trước triển khai công khai.

## Cập nhật giao diện 2026-10-15

- Dashboard của Freelancer, Client, Admin và điều hướng nhóm đã được thay bằng UI mới trong `workspace.js`/`workspace.css`.
- Avatar, thông báo, truy cập TalentCredit và Premium: giữ các dữ liệu và hành động hiện có, không phải dịch vụ tài chính/realtime thật.
- Tìm kiếm dashboard nối tới bộ lọc công khai `jobs.html?q=...` và `candidates.html?q=...`.
- Tab kết nối/dự án giữ cùng API nghiệp vụ, chỉ thay cách tổ chức giao diện.
- Admin chỉ xem thỏa thuận/dự án/milestone; hành động ký hoặc nghiệm thu thay người tham gia bị từ chối ở Service.
- **Chưa kiểm thử trên Tomcat/MySQL**, chi tiết `UX_REDESIGN_REPORT.md`.
