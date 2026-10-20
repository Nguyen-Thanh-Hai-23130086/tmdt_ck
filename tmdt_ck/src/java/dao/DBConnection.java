package dao;

import com.mysql.cj.jdbc.MysqlDataSource;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
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
            throw new RuntimeException("Lỗi đọc cấu hình database", e);
        }
    }

    public static Connection getConnection() throws Exception {
        Class.forName("com.mysql.cj.jdbc.Driver");

        return DriverManager.getConnection(
                getUrl(),
                properties.getProperty("db.username"),
                properties.getProperty("db.password")
        );
    }

    public static MysqlDataSource getDataSource() {
        MysqlDataSource dataSource = new MysqlDataSource();
        dataSource.setURL(getUrl());
        dataSource.setUser(properties.getProperty("db.username"));
        dataSource.setPassword(properties.getProperty("db.password"));
        return dataSource;
    }

    private static String getUrl() {
        return "jdbc:mysql://"
                + properties.getProperty("db.host") + ":"
                + properties.getProperty("db.port") + "/"
                + properties.getProperty("db.database")
                + "?useSSL=false&serverTimezone=Asia/Ho_Chi_Minh";
    }
}