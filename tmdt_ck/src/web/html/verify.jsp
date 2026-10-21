
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.Objects" %>

<%!
    private String escapeHtml(String value) {
        if (value == null) return "";
        return value.replace("&", "&amp;")
                    .replace("<", "&lt;")
                    .replace(">", "&gt;")
                    .replace("\"", "&quot;")
                    .replace("'", "&#39;");
    }
%>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận email | TalentMatch</title>
    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/verify.css">
</head>
<body>
<main class="verify-card">
    <div class="brand">TalentMatch</div>

    <div class="icon">✉</div>

    <h1>Xác nhận email</h1>

    <p class="description">
        Chúng tôi đã gửi mã xác nhận đến email đăng ký của bạn.
        Vui lòng kiểm tra hộp thư và nhập mã bên dưới.
    </p>

    <% if (request.getAttribute("msg") != null) { %>
        <p class="server-message">
            <%= escapeHtml((String) request.getAttribute("msg")) %>
        </p>
    <% } %>

    <div class="email-box">
        <span class="email-label">Email nhận mã xác nhận</span>
        <span id="verifyEmail"><%= escapeHtml(
            (String) request.getAttribute("verifyEmail")
        ) %></span>
    </div>

    <form id="verifyForm">
        <label for="code">Mã xác nhận</label>

        <input
            type="text"
            id="code"
            name="code"
            placeholder="000000"
            inputmode="numeric"
            pattern="[0-9]{6}"
            maxlength="6"
            autocomplete="one-time-code"
            required
        >

        <button type="submit" id="verifyButton">
            Xác nhận email
        </button>
    </form>

    <div id="message" role="status" aria-live="polite"></div>

    <a class="back-link"
       href="${pageContext.request.contextPath}/login">
        Quay lại đăng nhập
    </a>

    <p class="note">
        Mã xác nhận có hiệu lực trong 15 phút.
        Nếu không thấy email, hãy kiểm tra thư mục Spam hoặc Thư rác.
    </p>
</main>

<script>
    window.TALENTMATCH_CONTEXT_PATH =
        "${pageContext.request.contextPath}";
</script>
<script src="${pageContext.request.contextPath}/js/verify.js"></script>
</body>
</html>
