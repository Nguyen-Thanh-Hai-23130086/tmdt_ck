package controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.User;
import service.LoginService;

import java.io.IOException;

@WebServlet(value = "/login")
public class LoginController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        request.getRequestDispatcher("/html/login_register.jsp")
                .forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        String email = request.getParameter("email");
        String pass = request.getParameter("password");

        LoginService loginService = new LoginService();
        User user = loginService.login(email, pass);

        if (user != null) {
            // đăng nhập thành công
            HttpSession session = request.getSession();
            session.setAttribute("user", user);
            //check status
            if (!user.isStatus()) {
                request.setAttribute("err", "Tài khoản của bạn bị khóa");
                request.getRequestDispatcher("/html/login_register.jsp").forward(request, response);
            }
            String role = user.getRole();
            String roleName;

            if ("ADMIN".equalsIgnoreCase(role)) {
                roleName = "Quản trị viên";
            } else if ("USER".equalsIgnoreCase(role)) {
                roleName = "Nhà tuyển dụng";
            } else if ("FREELANCER".equalsIgnoreCase(role)) {
                roleName = "Ứng viên";
            } else {
                request.setAttribute("err", "Vai trò tài khoản không hợp lệ");
                request.getRequestDispatcher("/html/login_register.jsp")
                        .forward(request, response);
                return;
            }

            request.setAttribute("loginMessage",
                    "Đăng nhập thành công!\n"
                            + "Họ tên: " + user.getName() + "\n"
                            + "Email: " + user.getEmail() + "\n"
                            + "Vai trò: " + roleName);

            request.getRequestDispatcher("/html/login_register.jsp")
                    .forward(request, response);
            return;
//            // Check role
//            String role = user.getRole();
//
//            if ("ADMIN".equalsIgnoreCase(role)) {
//                response.sendRedirect("admin");
//            } else if ("CLIENT".equalsIgnoreCase(role)) {
//                response.sendRedirect("client");
//            } else if ("FREELANCER".equalsIgnoreCase(role)) {
//                response.sendRedirect("freelancer");
//            } else {
//                request.setAttribute("err", "Vai trò tài khoản không hợp lệ");
//                request.getRequestDispatcher("/html/login_register.jsp")
//                        .forward(request, response);
//            }
        }
    }
}