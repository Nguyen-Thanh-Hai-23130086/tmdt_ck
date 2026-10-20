<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng nhập | TalentMatch</title>
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/login_register.css">
</head>
<body>
<header class="topbar">
    <a href="#" class="brand" aria-label="TalentMatch">
        <span class="brand-symbol"><i></i><i></i><i></i><i></i></span>
        <span><strong>Talent<span>Match</span></strong><small>KẾT NỐI TÀI NĂNG - KIẾN TẠO TƯƠNG LAI</small></span>
    </a>
    <nav>
        <a href="#">Trang chủ</a><a href="#">Tìm việc làm</a><a href="#">Tìm ứng viên</a><a href="#">Doanh nghiệp</a><a
            href="#">Về chúng tôi</a>
    </nav>
    <div class="top-actions">
        <button class="search" aria-label="Tìm kiếm">⌕</button>
        <a class="login-top" href="#">Đăng nhập</a>
        <a class="signup-top" href="#" id="signupButton">Đăng ký</a>
    </div>
</header>

<main class="main-layout">
    <div class="intro-inner">
        <div class="eyebrow"><span>ϟ</span> Nền tảng kết nối việc làm hàng đầu Việt Nam</div>
        <h1>Mở lối cơ hội.<br><span>Kết nối tương lai.</span></h1>
        <p class="intro-copy">TalentMatch giúp bạn tìm kiếm việc làm phù hợp,<br class="wide-only"> kết nối với
            những nhà tuyển dụng uy tín và phát triển<br class="wide-only"> sự nghiệp một cách bền vững.</p>

        <ul class="feature-list">
            <li><span class="feature-icon">▣</span>Việc làm đa dạng, cập nhật liên tục</li>
            <li><span class="feature-icon">♧</span>Kết nối trực tiếp với nhà tuyển dụng</li>
            <li><span class="feature-icon">↗</span>Tư vấn nghề nghiệp chuyên sâu</li>
            <li><span class="feature-icon">◇</span>Cộng đồng chuyên nghiệp, năng động</li>
        </ul>
    </div>

    <div class="login-card">
        <div class="login-brand brand-symbol"><i></i><i></i><i></i><i></i></div>
        <h2>Đăng nhập</h2>
        <p class="welcome">Chào mừng bạn trở lại TalentMatch!</p>

        <div class="account-tabs">
            <button type="button" class="selected"><span>♟</span> Ứng viên</button>
            <button type="button"><span>▤</span> Nhà tuyển dụng</button>
        </div>
<% if (request.getAttribute("err") != null) { %>
    <p class="error-message">
        <%= request.getAttribute("err") %>
    </p>
<% } %>
        <form action="/talentmatch/login" method="post">
            <label for="email">Email hoặc số điện thoại <b>*</b></label>
            <div class="input-box"><span>✉</span><input id="email" name="email" type="text"
                                                        placeholder="Nhập email hoặc số điện thoại"
                                                        autocomplete="username" required></div>

            <label for="password">Mật khẩu <b>*</b></label>
            <div class="input-box"><span>♙</span><input id="password" name="password" type="password"
                                                        placeholder="Nhập mật khẩu" autocomplete="current-password"
                                                        required>
                <button class="toggle-password" type="button" aria-label="Hiện mật khẩu">◉</button>
            </div>

            <div class="form-meta"><label class="remember"><input type="checkbox" name="remember" checked><span>Ghi nhớ đăng nhập</span></label><a
                    href="#">Quên mật khẩu?</a></div>
            <button class="submit" type="submit">Đăng nhập <span>→</span></button>
        </form>

        <div class="divider"><span>Hoặc đăng nhập bằng</span></div>
        <div class="socials">
            <a href="#"><b class="google">G</b> Google</a>
            <a href="#"><b class="facebook">f</b> Facebook</a>
            <a href="#"><b class="apple">●</b> Apple</a>
        </div>
        <p class="register">Chưa có tài khoản? <a href="#" id="registerLink">Đăng ký ngay</a></p>
    </div>
</main>

<footer class="footer">
    <div class="footer-content">
        <div class="footer-brand">
            <a href="#" class="brand brand-footer"><span
                    class="brand-symbol"><i></i><i></i><i></i><i></i></span><span><strong>Talent<span>Match</span></strong><small>KẾT NỐI TÀI NĂNG - KIẾN TẠO TƯƠNG LAI</small></span></a>
            <div class="footer-social"><a href="#">f</a><a href="#">in</a><a href="#">▶</a><a href="#">◎</a></div>
        </div>
        <div class="footer-col"><h3>Dành cho người tìm việc</h3><a href="#">Tìm việc làm</a><a href="#">Tạo hồ sơ</a><a
                href="#">Hướng dẫn</a></div>
        <div class="footer-col"><h3>Dành cho nhà tuyển dụng</h3><a href="#">Đăng tin tuyển dụng</a><a href="#">Tìm ứng
            viên</a><a href="#">Bảng giá</a></div>
        <div class="footer-col"><h3>Về TalentMatch</h3><a href="#">Giới thiệu</a><a href="#">Chính sách bảo mật</a><a
                href="#">Điều khoản sử dụng</a></div>
        <div class="footer-col"><h3>Hỗ trợ</h3><a href="#">Trung tâm trợ giúp</a><a href="#">Câu hỏi thường gặp</a><a
                href="#">Liên hệ</a></div>
        <div class="newsletter"><h3>Đăng ký nhận tin</h3>
            <form action="#"><input type="email" placeholder="Nhập email của bạn">
                <button type="submit">→</button>
            </form>
            <small>Nhận tin việc làm và các cơ hội mới nhất</small></div>
    </div>
    <div class="footer-bottom"><span>© 2025 TalentMatch. Tất cả quyền được bảo lưu.</span>
        <div><a href="#">f</a><a href="#">in</a><a href="#">▶</a><a href="#">◎</a><a href="#">◎</a></div>
    </div>
</footer>
<%
    String loginMessage = (String) request.getAttribute("loginMessage");
    if (loginMessage != null) {
%>
<script>
    alert("<%= loginMessage
        .replace("\\", "\\\\")
        .replace("\"", "\\\"")
        .replace("\r", "")
        .replace("\n", "\\n") %>");
</script>
<%
    }
%>
</body>
<script src="${pageContext.request.contextPath}/js/login_register.js"></script>
mvn clean package</html>
