# Danh mục màn hình UI đã rà soát

Source hiện tại chỉ có **một** `src/web/html/workspace.html` dùng chung cho Freelancer/Client/Admin, các màn hình nghiệp vụ được tạo từ `src/web/js/workspace.js` theo `view` và role. Vì thế việc kiểm tra theo “trang” phải tính các **chế độ xem** (không phải 52 file HTML riêng biệt). Các chế độ xem không tạo API hoặc nghiệp vụ mới.

## Freelancer — 16 view

`dashboard`, `profile`, `settings`, `jobs`, `applications`, `invitations`, `agreements`, `projects`, `milestones`, `messages`, `payments`, `reviews`, `credits`, `premium`, `reports`, `notifications`.

Điều hướng chính: Tổng quan; Kết nối & thỏa thuận; Quản lý dự án; Hỗ trợ & tranh chấp. Hồ sơ/CV/portfolio và cài đặt đặt trong avatar; TalentCredit, gói tài khoản, thông báo ở header.

## Client — 17 view

`dashboard`, `company`, `settings`, `jobs`, `freelancers`, `applications`, `invitations`, `agreements`, `projects`, `milestones`, `messages`, `payments`, `reviews`, `credits`, `premium`, `reports`, `notifications`.

Điều hướng chính: Tổng quan; Hồ sơ doanh nghiệp; Tuyển dụng & tìm người; Kết nối & thỏa thuận; Quản lý dự án; Tranh chấp & hỗ trợ. Các lối truy cập avatar/header còn nguyên.

## Admin — 19 view

`dashboard`, `settings`, `users`, `jobs`, `freelancers`, `applications`, `invitations`, `agreements`, `projects`, `milestones`, `messages`, `payments`, `reviews`, `credits`, `reports`, `categories`, `premium`, `policies`, `notifications`.

7 nhóm sidebar theo mảng quản trị; các tab con giữ các view và dữ liệu cũ. Không bổ sung chức năng quản trị chưa có backend.

## Trang HTML công khai được rà soát tĩnh

`home.html`, `jobs.html`, `job-detail.html`, `candidates.html`, `candidate-detail.html`, `profile.html`, `about.html`. Kiểm tra header sticky, chiều rộng và tràn ngang trên 5 breakpoint. Trang `login_register.html` **không chỉnh sửa** trong lượt này; CSS riêng của nó cũng không bị thay đổi. Có kiểm tra tĩnh đường dẫn trong bộ test có sẵn nhưng chưa chạy end-to-end đăng nhập trên Tomcat/MySQL.

## Phạm vi kiểm tra

- 52 role-view x 5 kích thước = **260 tình huống bố cục/điều hướng**.
- Bộ kiểm thử bổ sung thực hiện **871 phép kiểm tra/đo lường**: nội dung không rỗng, độ rộng trang, dropdown, tab/sidebar, sticky header, backdrop menu; gồm nhiều phép đo trên cùng view.
- 7 trang công khai x 5 kích thước = **35 tình huống**, 70 phép đo.
- Test qua Chromium set_content với CSS/JS source thực tế; **không đại diện cho kiểm thử API/MySQL/Tomcat trên HTTP**.
