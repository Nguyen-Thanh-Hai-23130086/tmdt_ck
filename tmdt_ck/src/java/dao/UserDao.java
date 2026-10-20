package dao;

import model.User;

public class UserDao extends BaseDao {

    public User findByEmail(String email) {
        return get().withHandle(h ->
                h.createQuery(
                                "SELECT uid, name, email, phone, password, bdate, avatar, " +
                                        "role, status, email_status AS emailStatus, " +
                                        "verification_code_hash AS verificationCodeHash, " +
                                        "verification_expires_at AS verificationExpiresAt, " +
                                        "email_verified_at AS emailVerifiedAt " +
                                        "FROM users WHERE email = :email"
                        )
                        .bind("email", email)
                        .mapToBean(User.class)
                        .findOne()
                        .orElse(null)
        );
    }
}