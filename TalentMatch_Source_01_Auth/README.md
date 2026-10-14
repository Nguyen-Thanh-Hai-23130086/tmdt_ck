# TalentMatch — Source 01 Auth

**Bản nguồn:** `TalentMatch_Source_01_Auth` (chỉnh sửa từ file `TalentMatch.zip`, không ghi đè source gốc).

**Bắt đầu tại đây:** [Hướng dẫn cài đặt và thử 6 chức năng](docs/AUTH_SETUP_SOURCE_01.md) · [Báo cáo kiểm thử thực tế](docs/TEST_REPORT_SOURCE_01.md) · [Change log](docs/CHANGELOG_SOURCE_01_AUTH.md).

**Lưu ý:** `backend/.env` và `node_modules` không đóng gói. Hãy tự tạo `.env` từ `backend/.env.example`; chạy `npm ci` trên máy cá nhân, khởi động Docker PostgreSQL/Mailpit và Prisma migration an toàn. 6 luồng đã có code và test mock, nhưng **chưa được kiểm nghiệm thực tế với tài khoản Google/Facebook hay email Gmail trên hạ tầng của bạn**.

---

# TalentMatch — Client × Freelancer (bản nâng cấp từ MVP)

TalentMatch là website bài tập lớn mô phỏng vòng đời hợp tác giữa khách hàng (Client) và freelancer. Đây là **source nâng cấp trực tiếp từ TalentMatch_Source_MVP(1).zip**, không thay thế stack hoặc thiết kế gốc. Frontend dùng React 19 + Vite 6; backend Node.js 20+ + Express 4; PostgreSQL 16 + Prisma 6.4.1. Có xác thực bằng session cookie, phân quyền ở API và thanh toán **demo, không xử lý tiền thật**.

## Chạy nhanh với Windows / PowerShell

Cài **Node.js 20+**, Docker Desktop đang hoạt động (hoặc PostgreSQL 16), rồi mở VS Code Terminal tại thư mục `TalentMatch`:

```powershell
# chỉ chạy khi Docker Desktop đã mở
# Docker tạo PostgreSQL (5432) và Mailpit SMTP/UI (1025/8025)
docker compose up -d db mailpit

# sao chép cấu hình development
Copy-Item backend/.env.example backend/.env

# cài đặt và khởi tạo (cần Internet ở lần cài npm đầu tiên)
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed

# frontend và backend đồng thời trong MỘT terminal
npm run dev
```

- Website: **http://localhost:5173**
- API health: **http://localhost:4000/api/health** (mong đợi `database: connected`)
- Hộp thư thử nghiệm: **http://localhost:8025**
- Dừng hai server: **Ctrl+C** tại terminal đang chạy `npm run dev`.

`npm run dev` sử dụng **concurrently**, thay thế cú pháp `&` không ổn định trên Windows. `npm run dev:backend` và `npm run dev:frontend` vẫn tồn tại để debug từng phần.

> **Tình trạng kiểm thử:** Mã nguồn, migrations và seed đã được tạo. Trong môi trường tạo bản bàn giao, npm registry không truy cập được, không có Docker hoặc PostgreSQL. Vì thế **chưa thể xác nhận `npm install`, Prisma validate/generate/migrate, seed, Vite build, upload thật, Mailpit thực tế hay API E2E**. Đã chạy đạt 7/7 unit test thuần Node và kiểm tra cú pháp JS/JSX. Xem `docs/TESTING.md` và `docs/KNOWN_LIMITATIONS.md` trước khi trình diễn.

## Tài khoản demo

Chạy seed sẽ tạo **100 tài khoản** trong database trống: **2 Admin, 23 Client, 75 Freelancer**, cùng 36 dự án đa lĩnh vực, 108 ứng tuyển, 15 workspace, milestone, tin nhắn, lời mời, khiếu nại, giao dịch mô phỏng, đánh giá và file minh họa SVG tự sinh. Dữ liệu được đánh dấu demo; các file avatar, cover, logo là **hình minh họa vector**, không phải ảnh người thật.

| Vai trò | Email | Mật khẩu mới khi seed DB trống |
|---|---|---|
| Admin | `admin@talentmatch.local` | `AdminDemo!2026` |
| Admin 2 | `admin2@talentmatch.local` | `AdminDemo!2026` |
| Client | `client@talentmatch.local` | `ClientDemo!2026` |
| Freelancer | `freelancer@talentmatch.local` | `FreelancerDemo!2026` |
| Freelancer designer | `designer@talentmatch.local` | `FreelancerDemo!2026` |

Các tài khoản khác: `client02@talentmatch.local` ... `client23@talentmatch.local` và `freelancer03@talentmatch.local` ... `freelancer75@talentmatch.local`, cùng mật khẩu theo vai trò. **Nếu cơ sở dữ liệu đã từng seed bằng bản cũ, mật khẩu cũ được giữ nguyên**; cụ thể tài khoản `designer@talentmatch.local` có thể dùng `DesignerDemo!2026` từ source ban đầu. Không nên dùng các mật khẩu demo trên production.

## Những phần source đã có

- Đăng ký email, gửi link xác minh bằng SMTP/Mailpit, link có hạn và dùng một lần, gửi lại link.
- Đăng nhập/đăng xuất, phiên cookie, khóa tài khoản, quên/đặt lại mật khẩu và thu hồi phiên cũ.
- Google/Facebook OAuth callback, kiểm tra state; chỉ liên kết với tài khoản hiện có sau khi người dùng đăng nhập rõ ràng; **chờ credentials và test thực tế**.
- Hồ sơ Client/Freelancer, upload avatar, logo doanh nghiệp, ảnh portfolio qua multer/file-type/Sharp (JPEG, PNG, WebP); có preview avatar.
- Đăng và quản lý dự án, tìm kiếm, ứng tuyển, rút đơn, từ chối/chấp nhận, đóng dự án, gửi/nhận lời mời, matching **theo quy tắc**.
- Workspace, milestone, gửi bàn giao, chỉnh sửa, nghiệm thu, chat lưu DB, thanh toán **demo**, đánh giá và khiếu nại.
- Admin: danh sách người dùng/dự án, khóa user, ẩn/mở dự án, xử lý khiếu nại và audit logs.
- UI giữ thiết kế gốc và bổ sung header sticky, trạng thái error/success, trang email/reset, lời mời và khiếu nại.

## Kiểm thử sau khi khởi động

```powershell
npm test                  # unit test + integration test (integration mặc định skip)
npm run build             # frontend production build
npm run test:e2e          # kiểm tra nghiệp vụ API với database và server đang chạy
```

`test:e2e` tạo một dự án **demo mới** trong database development để test, không xóa dữ liệu. Hãy chạy trên DB thử nghiệm. Xem `docs/TESTING.md` để kiểm tra Mailpit và seed lặp.

## Giới hạn quan trọng

Dự án chưa được chạy thử toàn bộ hệ thống với PostgreSQL trong môi trường tạo ZIP. OAuth chưa test đăng nhập với provider, email SMTP chưa kiểm thử live, giao diện chưa được render/kiểm tra responsive bằng browser thật. Chưa có CV riêng tư, thanh toán thật/escrow, WebSocket real-time, i18n hoàn chỉnh, dashboard phân tích đầy đủ và một số luồng Admin mở rộng. **Không dùng trực tiếp trên Internet/production** mà chưa kiểm tra bảo mật, backup, quyền truy cập và tích hợp từ đầu tới cuối.

## Cấu trúc source

```
TalentMatch/
├── backend/
│   ├── prisma/schema.prisma
│   ├── prisma/migrations/         # bản cũ + 4 migration bổ sung
│   ├── prisma/seed.js             # seed 100 account & dữ liệu liên kết
│   ├── src/lib/                  # DB, SMTP, session, HTTP errors
│   ├── src/routes/               # API xác thực, việc, profile, mời, khiếu nại...
│   ├── src/services/             # rule-based matching, trạng thái
│   └── tests/                    # unit, integration, E2E script
├── frontend/src/
│   ├── pages/                    # trang gốc và tài khoản email/reset
│   ├── components/               # giao diện lời mời, gợi ý...
│   ├── context/                  # phiên, theme, language
│   ├── lib/                      # fetch API
│   └── styles/main.css           # giao diện gốc, sửa header sticky
├── docs/                         # cài đặt, kiến trúc, OAuth, giới hạn, kiểm thử
├── docker-compose.yml           # PostgreSQL & Mailpit
└── package.json                 # 1 terminal qua concurrently
```

**Đọc thêm:** `docs/SETUP.md`, `docs/ENVIRONMENT.md`, `docs/DATABASE.md`, `docs/OAUTH_SETUP.md`, `docs/DEMO_ACCOUNTS.md`, `docs/TESTING.md`, `docs/API_DOCUMENTATION.md`, `docs/KNOWN_LIMITATIONS.md`.
