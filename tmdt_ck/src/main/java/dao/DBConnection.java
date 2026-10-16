package dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.io.InputStream;
import java.util.Properties;

public class DBConnection {
    private static final Properties properties = new Properties();

    static {
        try (InputStream input = DBConnection.class
                .getClassLoader()
                .getResourceAsStream("db.properties")) {

            if (input == null) {
                throw new RuntimeException("Không tìm thấy db.properties");
            }

            properties.load(input);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi đọc cấu hình database", e);
        }
    }

    public static Connection getConnection() throws Exception {
        Class.forName("com.mysql.cj.jdbc.Driver");

        String url = "jdbc:mysql://"
                + properties.getProperty("db.host") + ":"
                + properties.getProperty("db.port") + "/"
                + properties.getProperty("db.database")
                + "?useSSL=false&serverTimezone=Asia/Ho_Chi_Minh";

        return DriverManager.getConnection(
                url,
                properties.getProperty("db.username"),
                properties.getProperty("db.password")
        );
    }
}