
package controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import service.RegisterService;

import java.io.IOException;

@WebServlet("/register")
public class RegisterController extends HttpServlet {
    private final RegisterService registerService = new RegisterService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        request.getRequestDispatcher("/html/register.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        String fullName = request.getParameter("fullName");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirmPassword");

        if (fullName == null || fullName.isBlank()
                || email == null || email.isBlank()
                || password == null || password.isBlank()
                || confirmPassword == null || confirmPassword.isBlank()) {
            showRegisterError(request, response, "Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        email = email.trim();

        if (!password.equals(confirmPassword)) {
            showRegisterError(request, response, "Mật khẩu xác nhận không khớp.");
            return;
        }

        String result = registerService.addUser(email, password, fullName);

        switch (result) {
            case "NEW_USER":
                showVerifyPage(request, response, email,
                        "Đăng ký thành công. Vui lòng kiểm tra email để xác nhận.");
                break;

            case "RESEND_CODE":
                showVerifyPage(request, response, email,
                        "Mã xác nhận mới đã được gửi đến email của bạn.");
                break;

            case "EMAIL_VERIFIED":
                showRegisterError(request, response,
                        "Email này đã được xác nhận và đang được sử dụng.");
                break;

            case "EMAIL_ERROR":
                showRegisterError(request, response,
                        "Tài khoản đã được xử lý nhưng gửi email thất bại. Vui lòng thử lại.");
                break;

            default:
                showRegisterError(request, response,
                        "Không thể đăng ký. Vui lòng thử lại.");
                break;
        }
    }

    private void showVerifyPage(HttpServletRequest request,
                                HttpServletResponse response,
                                String email,
                                String msg)
            throws ServletException, IOException {
        request.setAttribute("verifyEmail", email);
        request.setAttribute("msg", msg);
        request.getRequestDispatcher("/html/verify.jsp").forward(request, response);
    }

    private void showRegisterError(HttpServletRequest request,
                                   HttpServletResponse response,
                                   String err)
            throws ServletException, IOException {
        request.setAttribute("err", err);
        request.getRequestDispatcher("/html/register.jsp").forward(request, response);
    }
}