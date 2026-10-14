# OAUTH_SETUP — Google / Facebook (môi trường local)

**Source 01:** bổ sung Google nonce/exp, Facebook yêu cầu xác minh email trước khi cấp session cho account chưa được xác minh, và callback redirect lỗi an toàn. Chưa có Google/Meta credentials thật nên các luồng chỉ được kiểm qua mô phỏng; chưa xác nhận OAuth thật.

## 1. Google OAuth

1. Vào https://console.cloud.google.com/ và tạo/chọn Google Cloud project.
2. Mở Google Auth Platform, cấu hình Branding, Audience và Test users nếu ứng dụng đang ở chế độ Testing (các tên menu có thể thay đổi).
3. Tạo OAuth Client kiểu **Web application**.
4. Điền Authorized redirect URI chính xác: `http://localhost:4000/api/oauth/google/callback`.
5. Nếu dashboard yêu cầu JavaScript origin, khai báo `http://localhost:5173` hoặc URL tương ứng ứng dụng (luồng này dùng backend redirect).
6. Đưa Client ID và Client Secret vào `backend/.env` với tên `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
7. Chạy lại `npm run dev`; mở `/login`, bấm Google, hoàn tất consent và xác minh người dùng được chuyển về `/dashboard`.
8. Kiểm thử hủy consent, email trùng với phương thức khác, tài khoản bị khóa và đăng xuất.

Google dùng authorization code + PKCE + state, xác minh ID token bằng JWKS issuer/audience, kiểm tra email_verified. Không đưa Client Secret vào frontend.

## 2. Facebook Login

1. Vào https://developers.facebook.com/ và tạo Meta App với Facebook Login phù hợp use case.
2. Cấu hình Valid OAuth Redirect URI: `http://localhost:4000/api/oauth/facebook/callback`.
3. Đặt `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET` trong `backend/.env`. Kiểm tra `FACEBOOK_API_VERSION` theo phiên bản hiện được Meta hỗ trợ.
4. Khi app ở Development mode dùng tài khoản có quyền trong app (developer, tester...). Các tài khoản ngoài nhóm cần cấu hình/policy/review thích hợp khi app Live.
5. Khởi động backend, bấm Facebook ở `/login`; kiểm thử grant/cancel/callback.
6. Nếu provider không cấp email, hệ thống từ chối tạo tài khoản OAuth và hướng dẫn đăng ký email thay thế. Email Facebook không được tự đánh dấu đã xác minh nếu provider không bảo đảm trạng thái đó.

Backend xác minh Facebook token bằng `debug_token`, kiểm tra app ID/user ID và `appsecret_proof` trước khi đọc hồ sơ. Nếu tạo tài khoản mới từ Facebook, server yêu cầu **xác minh email qua thư** trước khi cấp session vì Facebook không luôn cung cấp attestation về email_verified.

## 3. Tài khoản đã có và liên kết OAuth an toàn

Nếu OAuth trả về email đã được đăng ký TalentMatch nhưng provider ID chưa được liên kết, hệ thống **không tự gộp tài khoản bằng cách so email**. Người dùng phải đăng nhập bằng phương thức gốc, vào `/profile` phần **Liên kết phương thức đăng nhập**, chọn Google/Facebook. Route start dùng `?link=1`, lưu userId của tài khoản đã xác thực trong OAuth state, callback chỉ tạo liên kết khi session vẫn là đúng user đó. Không cho linked provider ID thuộc về hai account.

Nếu OAuth chưa cấu hình, giao diện hiển thị thông báo; endpoint start trả HTTP 503. Trường hợp provider thực tế yêu cầu HTTPS cho callback hoặc app review, hãy làm theo hướng dẫn của provider, không thay client secret bằng placeholder và gọi là hoạt động.

## 4. Production

Trước khi xuất bản Internet, thay URL callback bằng domain HTTPS thật, cấu hình privacy policy/terms/app verification, bật secure cookie/proxy HTTPS, lưu secret trong hệ thống secrets phù hợp và kiểm thử lại toàn bộ flow. Không dùng demo OAuth credentials production.

Hướng dẫn 6 chức năng đầy đủ, phương án email thật và báo cáo test: `AUTH_SETUP_SOURCE_01.md`, `TEST_REPORT_SOURCE_01.md`.
