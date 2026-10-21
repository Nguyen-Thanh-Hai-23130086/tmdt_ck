package controller;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.User;
import util.Http;

import java.io.IOException;
import java.util.Map;

@WebServlet(urlPatterns = "/api/auth/*")
public class AuthController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (!"/me".equals(request.getPathInfo())) {
            Http.write(response, 404, Http.error("Không tìm thấy endpoint"));
            return;
        }

        User user = Http.loggedIn(request);
        if (user == null) {
            Http.write(response, 401, Http.error("Yêu cầu đăng nhập"));
            return;
        }
        Http.write(response, 200, Map.of("user", Http.publicUser(user)));
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (!"/logout".equals(request.getPathInfo())) {
            Http.write(response, 404, Http.error("Không tìm thấy endpoint"));
            return;
        }
        if (!Http.mutationAllowed(request)) {
            Http.write(response, 403, Http.error("Yêu cầu không hợp lệ"));
            return;
        }

        HttpSession session = request.getSession(false);
        if (session != null) session.invalidate();
        Http.write(response, 200, Map.of("ok", true));
    }
}
