package controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dao.UserDao;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.User;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;

@WebServlet("/api/auth/verify")
public class VerifyEmailController extends HttpServlet {

    private final UserDao userDao = new UserDao();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String email;
        String code;

        try {
            JsonNode body = objectMapper.readTree(request.getInputStream());
            email = body.path("email").asText("").trim();
            code = body.path("code").asText("").trim();
        } catch (Exception e) {
            writeJson(response, 400, false,
                    "Dữ liệu gửi lên không hợp lệ.");
            return;
        }

        if (email.isBlank() || !code.matches("\\d{6}")) {
            writeJson(response, 400, false,
                    "Vui lòng nhập email và mã xác nhận gồm 6 chữ số.");
            return;
        }

        User user = userDao.findByEmail(email);

        if (user == null) {
            writeJson(response, 404, false,
                    "Không tìm thấy tài khoản với email này.");
            return;
        }

        if ("VERIFIED".equals(user.getEmailStatus())) {
            writeJson(response, 200, true,
                    "Email này đã được xác nhận trước đó.");
            return;
        }

        if (!"PENDING".equals(user.getEmailStatus())) {
            writeJson(response, 400, false,
                    "Tài khoản không ở trạng thái chờ xác nhận. Vui lòng đăng ký lại.");
            return;
        }

        String storedHash = user.getVerificationCodeHash();
        LocalDateTime expiresAt = user.getVerificationExpiresAt();
        LocalDateTime now = LocalDateTime.now();

        if (expiresAt == null || !expiresAt.isAfter(now)) {
            userDao.markUnverified(email);
            writeJson(response, 400, false,
                    "Mã xác nhận đã hết hạn. Vui lòng đăng ký lại để nhận mã mới.");
            return;
        }

        String codeHash = hashMd5(code);

        if (storedHash == null || !MessageDigest.isEqual(
                storedHash.getBytes(StandardCharsets.UTF_8),
                codeHash.getBytes(StandardCharsets.UTF_8))) {
            writeJson(response, 400, false,
                    "Mã xác nhận không chính xác.");
            return;
        }

        boolean verified = userDao.verifyEmail(email, codeHash, now);

        if (!verified) {
            writeJson(response, 400, false,
                    "Mã đã hết hạn hoặc đã được sử dụng. Vui lòng thử lại.");
            return;
        }

        writeJson(response, 200, true,
                "Xác nhận email thành công! Bạn có thể đăng nhập.");
    }

    private String hashMd5(String value) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hash = md.digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder result = new StringBuilder();

            for (byte b : hash) {
                result.append(String.format("%02x", b & 0xff));
            }

            return result.toString();
        } catch (Exception e) {
            throw new IllegalStateException("Không thể băm mã xác nhận.", e);
        }
    }

    private void writeJson(HttpServletResponse response,
                           int status,
                           boolean success,
                           String message) throws IOException {
        response.setStatus(status);

        response.getWriter().write(objectMapper.writeValueAsString(
                java.util.Map.of(
                        "success", success,
                        "message", message
                )
        ));
    }
}