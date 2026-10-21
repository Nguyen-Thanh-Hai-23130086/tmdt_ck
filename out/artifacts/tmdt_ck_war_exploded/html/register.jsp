<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng ký | TalentMatch</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/login.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/register.css">
</head>
<body>
<header class="topbar">
    <a href="#" class="brand" aria-label="TalentMatch">
        <span class="brand-symbol"><i></i><i></i><i></i><i></i></span>
        <span>
            <strong>Talent<span>Match</span></strong>
            <small>KẾT NỐI TÀI NĂNG - KIẾN TẠO TƯƠNG LAI</small>
        </span>
    </a>

    <nav>
        <a href="#">Trang chủ</a>
        <a href="#">Tìm việc làm</a>
        <a href="#">Tìm ứng viên</a>
        <a href="#">Doanh nghiệp</a>
        <a href="#">Về chúng tôi</a>
    </nav>

    <div class="top-actions">
        <button class="search" aria-label="Tìm kiếm">⌕</button>
        <a class="login-top"
           href="${pageContext.request.contextPath}/login">Đăng nhập</a>
        <a class="signup-top"
           href="${pageContext.request.contextPath}/register">Đăng ký</a>
    </div>
</header>

<main class="main-layout">
    <div class="intro-inner">
        <div class="eyebrow">
            <span>ϟ</span> Nền tảng kết nối việc làm hàng đầu Việt Nam
        </div>

        <h1>Bắt đầu hành trình.<br><span>Kiến tạo tương lai.</span></h1>

        <p class="intro-copy">
            Tạo tài khoản TalentMatch để tiếp cận những cơ hội nghề nghiệp,
            kết nối với doanh nghiệp và phát triển sự nghiệp của bạn.
        </p>

        <ul class="feature-list">
            <li><span class="feature-icon">▣</span>Khám phá cơ hội việc làm phù hợp</li>
            <li><span class="feature-icon">♧</span>Kết nối với nhà tuyển dụng</li>
            <li><span class="feature-icon">↗</span>Xây dựng hồ sơ chuyên nghiệp</li>
            <li><span class="feature-icon">◇</span>Phát triển sự nghiệp bền vững</li>
        </ul>
    </div>

    <div class="login-card register-card">
        <div class="login-brand brand-symbol">
            <i></i><i></i><i></i><i></i>
        </div>

        <h2>Tạo tài khoản</h2>
        <p class="welcome">Tham gia cộng đồng TalentMatch ngay hôm nay!</p>

        <% if (request.getAttribute("err") != null) { %>
        <p class="error-message">
            <%= request.getAttribute("err") %>
        </p>
        <% } %>

        <form action="${pageContext.request.contextPath}/register" method="post">
            <label for="fullName">Họ và tên <b>*</b></label>
            <div class="input-box">
                <span>♙</span>
                <input id="fullName" name="fullName" type="text"
                       placeholder="Nhập họ và tên"
                       autocomplete="name" required>
            </div>

            <label for="email">Email <b>*</b></label>
            <div class="input-box">
                <span>✉</span>
                <input id="email" name="email" type="email"
                       placeholder="Nhập địa chỉ email"
                       autocomplete="email" required>
            </div>

            <label for="password">Mật khẩu <b>*</b></label>
            <div class="input-box">
                <span>♙</span>
                <input id="password" name="password" type="password"
                       placeholder="Tối thiểu 8 ký tự"
                       autocomplete="new-password"
                       minlength="8" required>
                <button class="toggle-password" type="button"
                        aria-label="Hiện mật khẩu">◉</button>
            </div>

            <label for="confirmPassword">Xác nhận mật khẩu <b>*</b></label>
            <div class="input-box">
                <span>♙</span>
                <input id="confirmPassword" name="confirmPassword"
                       type="password" placeholder="Nhập lại mật khẩu"
                       autocomplete="new-password"
                       minlength="8" required>
            </div>

            <label for="role">Bạn muốn đăng ký với tư cách <b>*</b></label>
            <div class="input-box">
                <span>▤</span>
                <select id="role" name="role" required>
                    <option value="FREELANCER">Ứng viên / Freelancer</option>
                    <option value="USER">Người tìm việc</option>
                    <option value="CLIENT">Nhà tuyển dụng</option>
                </select>
            </div>

            <label class="terms">
                <input type="checkbox" name="agreeTerms" required>
                <span>Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật.</span>
            </label>

            <button class="submit" type="submit">
                Đăng ký <span>→</span>
            </button>
        </form>

        <p class="register">
            Đã có tài khoản?
            <a href="${pageContext.request.contextPath}/login">Đăng nhập ngay</a>
        </p>
    </div>
</main>

<footer class="footer">
    <div class="footer-content">
        <div class="footer-brand">
            <a href="#" class="brand brand-footer">
                <span class="brand-symbol"><i></i><i></i><i></i><i></i></span>
                <span>
                    <strong>Talent<span>Match</span></strong>
                    <small>KẾT NỐI TÀI NĂNG - KIẾN TẠO TƯƠNG LAI</small>
                </span>
            </a>
        </div>

        <div class="footer-col">
            <h3>Dành cho người tìm việc</h3>
            <a href="#">Tìm việc làm</a>
            <a href="#">Tạo hồ sơ</a>
            <a href="#">Hướng dẫn</a>
        </div>

        <div class="footer-col">
            <h3>Dành cho nhà tuyển dụng</h3>
            <a href="#">Đăng tin tuyển dụng</a>
            <a href="#">Tìm ứng viên</a>
            <a href="#">Bảng giá</a>
        </div>

        <div class="footer-col">
            <h3>Về TalentMatch</h3>
            <a href="#">Giới thiệu</a>
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Điều khoản sử dụng</a>
        </div>

        <div class="footer-col">
            <h3>Hỗ trợ</h3>
            <a href="#">Trung tâm trợ giúp</a>
            <a href="#">Câu hỏi thường gặp</a>
            <a href="#">Liên hệ</a>
        </div>
    </div>

    <div class="footer-bottom">
        <span>© 2025 TalentMatch. Tất cả quyền được bảo lưu.</span>
    </div>
</footer>

<script src="${pageContext.request.contextPath}/js/register.js"></script>
</body>
</html>
