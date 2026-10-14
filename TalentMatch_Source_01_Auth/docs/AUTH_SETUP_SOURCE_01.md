# TalentMatch Source 01 — Hướng dẫn cấu hình và thử 6 chức năng xác thực

## 1. Bản đầu vào, đầu ra và các giới hạn

- **Bản đầu vào:** `TalentMatch.zip` do người dùng cung cấp. Giữ file gốc riêng, KHÔNG ghi đè.
- **Bản bàn giao:** `TalentMatch_Source_01_Auth.zip`, bên trong có thư mục `TalentMatch_Source_01_Auth/`.
- Không đính kèm file `backend/.env`, `.git`, `node_modules`, file build hoặc dữ liệu PostgreSQL của máy cũ.
- Không thay đổi schema Prisma và không tạo migration mới ở lần này. Các migration sẵn có được giữ nguyên.
- Không có kết quả xác minh thực tế với Gmail, Google/Meta hay PostgreSQL trong môi trường bàn giao. Đọc `TEST_REPORT_SOURCE_01.md` để biết chính xác đã kiểm thử gì.

## 2. Chạy lần đầu (Windows PowerShell, Node.js >= 22, Docker Desktop)

Tại thư mục `TalentMatch_Source_01_Auth`:

```powershell
npm ci
Copy-Item backend/.env.example backend/.env
docker compose up -d
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:4000/api/health (database phải hiển thị `connected`)
- Mailpit: http://localhost:8025
- `npm run db:seed` là **tùy chọn**: chỉ chạy khi cần tài khoản/demo và đã đọc seed; KHÔNG sử dụng vô thức trên database thật.
- Với database đã tồn tại, **không** chạy `prisma migrate reset`, `db push --force-reset` hay lệnh xóa dữ liệu. Sao lưu PostgreSQL trước khi áp migration.
- Nếu máy bạn đã dùng cổng 5432, 1025, 8025, 4000 hoặc 5173, cần giải quyết xung đột cổng và đồng bộ URL trong `backend/.env` và Vite proxy.
- Linux/macOS: thay lệnh `Copy-Item` bằng `cp backend/.env.example backend/.env`.
- `docker compose` cung cấp database và Mailpit; Node/npm chạy trên máy chủ development (không phải trong container). Đọc `.env.example` trước khi chạy.

Nếu đang dùng database sẵn có, kiểm tra migration an toàn:

```powershell
cd backend
npx prisma migrate status
npx prisma migrate deploy
cd ..
```

`migrate deploy` chỉ áp migration còn thiếu, không tự động xóa database. Nếu có drift/migration lỗi, sao lưu và xử lý riêng trước khi tiếp tục. Migration mặc định có thể seed/điều chỉnh dữ liệu demo khi chạy script seed, nên đừng chạy seed trên production.

## 3. Kiểm thử 6 chức năng tại frontend

1. **Đăng ký:** mở `/register`, nhập họ tên, email, mật khẩu từ 10 ký tự, gồm chữ và số, vai trò CLIENT/FREELANCER và đồng ý điều khoản. Mở Mailpit ở `localhost:8025`, chọn thư xác minh, mở link; sau đó thử đăng ký lại cùng email (phải báo trùng). Nếu email không được gửi, giao diện dẫn đến trang gửi lại.
2. **Đăng nhập:** mở `/login`, thử sai mật khẩu, email chưa xác minh và tài khoản đã xác minh. Đăng nhập đúng phải đi `/dashboard`.
3. **Đăng xuất:** sau khi đăng nhập bấm Đăng xuất trên giao diện; `/dashboard` và các API yêu cầu session không được phép dùng cookie cũ.
4. **Quên mật khẩu:** mở `/forgot-password`, nhập email; mở email trong Mailpit; đặt mật khẩu mới tại `/reset-password?token=...`. Link đã dùng hoặc hết hạn phải bị từ chối. Những phiên cũ phải bị vô hiệu hóa.
5. **Google:** đặt OAuth Client ID/Secret và redirect URI như mục 5, sau đó chọn Google ở `/login`. Thử đồng ý, hủy, email trùng và liên kết từ hồ sơ sau khi đăng nhập.
6. **Facebook:** đặt App ID/Secret và callback như mục 5, chọn Facebook ở `/login`; nếu Facebook cấp email mà chưa có xác minh đáng tin cậy, phải xác minh qua email trước khi đăng nhập; nếu Facebook không cấp email thì dùng đăng ký qua email/Google, hoặc đăng nhập tài khoản hiện có rồi liên kết Facebook từ hồ sơ.

Các trường hợp tự động API mock được kiểm trong `backend/tests/auth-flow.test.js` và `mail-provider.test.js`. Chạy:

```powershell
npm run test --workspace backend
npm run build
```

Máy kiểm thử cần cài lại dependencies bằng `npm ci` đúng OS (không copy `node_modules` từ Windows sang Linux).

## 4. SMTP/Mailpit và email thật

### Phát triển, dùng Mailpit (mặc định)

```dotenv
MAIL_PROVIDER=smtp
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
MAIL_FROM="TalentMatch <no-reply@talentmatch.local>"
```

Mailpit **chỉ nhận và hiển thị email local**; Gmail thật sẽ KHÔNG nhận được email từ Mailpit. Gửi thành công qua SMTP nghĩa là máy chủ SMTP chấp nhận, không bảo đảm email tới inbox.

### Phương án A — Dùng Resend khi có người gửi được xác minh

1. Tạo tài khoản ở https://resend.com, bật sender/domain theo yêu cầu của nhà cung cấp.
2. Lấy API key trong dashboard Resend, lưu trong `backend/.env` của bạn (**không gửi trong chat, Git hoặc ZIP**).
3. Cấu hình:

```dotenv
MAIL_PROVIDER=resend
RESEND_API_KEY=your_real_key_on_your_machine_only
MAIL_FROM="TalentMatch <support@your-verified-domain.example>"
MAIL_TIMEOUT_MS=10000
```

4. Nếu đang dùng chế độ thử nghiệm hoặc không có domain được xác minh, nhà cung cấp có thể chỉ cho gửi tới địa chỉ được cho phép. Không mặc định được gửi Gmail bất kỳ. Khi có domain riêng, xác minh sender và thiết lập SPF/DKIM/DMARC theo Resend để cải thiện độ tin cậy. API trả `id` chỉ là **đã tiếp nhận yêu cầu gửi**, không phải chứng nhận Gmail đã nhận thư.
5. Email gửi qua Resend có `Idempotency-Key` dựa trên hash token để tránh nhà cung cấp xử lý cùng một yêu cầu hai lần. Không tự retry sau timeout vì kết quả có thể không chắc chắn.

### Phương án B — SMTP thật khi chưa có domain riêng

Có thể cấu hình SMTP được cấp phép bởi nhà cung cấp (ví dụ tài khoản Gmail hỗ trợ mật khẩu ứng dụng):

```dotenv
MAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-sender@gmail.com
SMTP_PASSWORD=your-app-password-on-your-machine
MAIL_FROM="TalentMatch <your-sender@gmail.com>"
```

Điều kiện và hạn mức SMTP tùy từng tài khoản/dịch vụ; một số tài khoản Google không có tùy chọn mật khẩu ứng dụng. Cần xác minh cấu hình và chính sách nhà cung cấp. Không dùng mật khẩu Gmail đăng nhập thông thường.

### Khi không nhận email

- Kiểm tra `backend/.env` thực tế: `SMTP_HOST=localhost`, `SMTP_PORT=1025` nghĩa là **chỉ tới Mailpit**.
- Nếu chọn Resend, kiểm tra domain/sender đã được xác minh, quyền gửi, API key, giới hạn tài khoản, log provider.
- Kiểm tra host, cổng, TLS, quyền truy cập mạng của SMTP, và hộp thư spam. Không ghi token/email secret vào log.
- Sau lỗi gửi, đăng ký vẫn tạo tài khoản pending; trang `/check-email` có chức năng gửi lại. Mặc định mỗi tài khoản được yêu cầu cách nhau ít nhất 60 giây, tối đa 5 token trong 60 phút; thêm giới hạn theo IP ở Express.
- Mật khẩu và token chỉ được xử lý backend, token chỉ lưu dưới dạng SHA-256 trong PostgreSQL; email có URL token, tránh công khai URL đó.

## 5. Tạo Google/Facebook credentials và callback

**Google Cloud Console:** https://console.cloud.google.com

- Tạo Google Cloud Project, cấu hình **Google Auth Platform** (Branding/Audience/Test users), tạo Client loại **Web application**.
- Authorized redirect URI: `http://localhost:4000/api/oauth/google/callback` (đúng từng ký tự). Nếu cần khai báo origin: `http://localhost:5173`.
- Điền vào `backend/.env`:

```dotenv
GOOGLE_CLIENT_ID=replace_locally
GOOGLE_CLIENT_SECRET=replace_locally
```

- Google dùng authorization code + PKCE + state + nonce. Server kiểm tra chữ ký Google JWKS, issuer, audience, thời hạn và email_verified. Không chấp nhận `id_token` không hợp lệ.
- Khi deploy, thay callback bằng `https://your-api-domain.example/api/oauth/google/callback`; cập nhật `BACKEND_URL`, `FRONTEND_URL` và khai báo URL mới trong Google Cloud.

**Meta for Developers:** https://developers.facebook.com

- Tạo Meta App, cấu hình use case **Facebook Login** và mục Facebook Login Settings.
- Valid OAuth Redirect URI: `http://localhost:4000/api/oauth/facebook/callback` nếu Meta cho phép với cấu hình/local test của bạn; một số tình huống yêu cầu HTTPS hoặc app domain phù hợp.
- Điền vào `backend/.env`:

```dotenv
FACEBOOK_APP_ID=replace_locally
FACEBOOK_APP_SECRET=replace_locally
FACEBOOK_API_VERSION=v22.0
```

- Kiểm tra lại phiên bản Graph API còn được Meta hỗ trợ lúc cấu hình. Chế độ Development thường chỉ cấp phép tài khoản app admin/developer/tester; Live hoặc public có thể yêu cầu khai báo chính sách riêng tư, quyền email, app review và kiểm duyệt.
- Backend dùng `debug_token`, kiểm tra app ID, user ID, token validity/expiry, dùng `appsecret_proof` khi đọc hồ sơ. Facebook có thể không cung cấp email hoặc email chưa được chứng thực. Lúc đó không cấp session cho account chưa xác minh email.
- Không tự gộp account theo email. Người dùng đã có tài khoản phải đăng nhập cách cũ, sau đó vào hồ sơ bấm liên kết Google/Facebook (đang sử dụng route `?link=1`). Liên kết yêu cầu session hiện tại cùng người dùng với state lưu trên server.
- Trong production: bắt buộc HTTPS, khai báo đúng callback origin, cấu hình reverse proxy/secure cookie, domain/URL và quyền OAuth trên dashboard của từng nhà cung cấp.

## 6. Bảng biến môi trường có liên quan

| Biến | Giá trị mẫu / mục đích |
|---|---|
| `DATABASE_URL` | PostgreSQL development localhost |
| `PORT` | 4000 |
| `FRONTEND_URL` | http://localhost:5173 |
| `BACKEND_URL` | http://localhost:4000 |
| `NODE_ENV` | development; production dùng HTTPS |
| `MAIL_PROVIDER` | smtp hoặc resend |
| `MAIL_TIMEOUT_MS` | 10000 |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` | Máy chủ, cổng, SSL/TLS SMTP |
| `SMTP_USER`, `SMTP_PASSWORD` | Tài khoản SMTP nếu được cấp phép |
| `MAIL_FROM` | Địa chỉ gửi hợp lệ với provider |
| `RESEND_API_KEY` | Chỉ khi dùng Resend |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth Client Web |
| `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET` | Meta app |
| `FACEBOOK_API_VERSION` | Phiên bản Graph API được hỗ trợ |

**Không điền secret thật vào `.env.example`. Không cần gửi mật khẩu, API key hoặc client secret cho trợ lý.**
