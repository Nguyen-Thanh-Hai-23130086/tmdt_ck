package controller;

import dao.UserDao;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.User;

import java.io.IOException;
import java.sql.SQLException;

@WebServlet("/login")
public class LoginController extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        String email = request.getParameter("email");
        String password = request.getParameter("password");

        try {
            UserDao userDao = new UserDao();
            User user = userDao.findByEmail(email == null ? "" : email.trim());

            if (user != null && password != null && password.equals(user.getPassword())) {
                request.getSession().setAttribute("user", user);
                response.getWriter().println("Đăng nhập thành công! Xin chào " + user.getFullName());
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().println("Email hoặc mật khẩu không chính xác!");
            }
        } catch (SQLException e) {
            getServletContext().log("Lỗi truy vấn khi đăng nhập", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("Có lỗi khi truy cập cơ sở dữ liệu!");
        }
    }
}