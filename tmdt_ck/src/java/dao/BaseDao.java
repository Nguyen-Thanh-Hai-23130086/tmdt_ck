package dao;

import org.jdbi.v3.core.Jdbi;

public abstract class BaseDao {
    private Jdbi jdbi;

    public Jdbi get() {
        if (jdbi == null) {
            jdbi = Jdbi.create(DBConnection.getDataSource());
        }
        return jdbi;
    }
}