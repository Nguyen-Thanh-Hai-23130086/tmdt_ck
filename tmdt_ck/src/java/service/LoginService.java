package service;

import dao.UserDao;
import model.User;

import java.sql.SQLException;

public class LoginService {
    private final UserDao userDao = new UserDao();

    //====== ĐĂNG NHẬP ======
    public User login(String email, String password) throws SQLException {
        if (email == null || email.isBlank()
                || password == null || password.isBlank()) {
            return null;
        }

        User user = userDao.findByEmail(email.trim());

        if (user == null) {
            return null;
        }

        if (!user.getPassword().equals(password)) {
            return null;
        }

        return user;
    }
}