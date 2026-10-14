
package dao;

import java.sql.Connection;
import java.sql.SQLException;

public abstract class BaseDao {

    protected Connection getConnection() throws SQLException {
        try {
            return DBConnection.getConnection();
        } catch (SQLException e) {
            throw e;
        } catch (Exception e) {
            throw new SQLException("Không thể kết nối MySQL", e);
        }
    }
}