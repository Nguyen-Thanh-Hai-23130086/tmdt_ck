package dao;

import model.User;

import java.time.LocalDateTime;

public class UserDao extends BaseDao {

    public User findByEmail(String email) {
        return get().withHandle(h ->
                h.createQuery("""
                                SELECT uid, name, email, phone, password, bdate, avatar,
                                       role, status, email_status AS emailStatus,
                                       verification_code_hash AS verificationCodeHash,
                                       verification_expires_at AS verificationExpiresAt,
                                       email_verified_at AS emailVerifiedAt
                                FROM users
                                WHERE email = :email
                                """)
                        .bind("email", email)
                        .mapToBean(User.class)
                        .findOne()
                        .orElse(null)
        );
    }

    // Thêm tài khoản mới cùng mã xác nhận
    public boolean addUser(
            String email, String pass, String name,
            String status, String codeHash,
            LocalDateTime expiresAt) {

        return get().withHandle(h ->
                h.createUpdate("""
                                INSERT INTO users (
                                    name, email, password, bdate, avatar,
                                    role, phone, status, email_status,
                                    verification_code_hash, verification_expires_at,
                                    email_verified_at
                                )
                                VALUES (
                                    :name, :email, :password, NULL,
                                    'images/userAvatar/default_user.jpg',
                                    'FREELANCER', NULL, TRUE, :emailStatus,
                                    :codeHash, :expiresAt, NULL
                                )
                                """)
                        .bind("name", name)
                        .bind("email", email)
                        .bind("password", pass)
                        .bind("emailStatus", status)
                        .bind("codeHash", codeHash)
                        .bind("expiresAt", expiresAt)
                        .execute()
        ) > 0;
    }

    // Cập nhật mã xác nhận cho tài khoản chưa xác nhận
    public boolean updateVerification(
            String email, String status,
            String codeHash, LocalDateTime expiresAt) {

        return get().withHandle(h ->
                h.createUpdate("""
                                UPDATE users
                                SET email_status = :emailStatus,
                                    verification_code_hash = :codeHash,
                                    verification_expires_at = :expiresAt,
                                    email_verified_at = NULL
                                WHERE email = :email
                                  AND email_status <> 'VERIFIED'
                                """)
                        .bind("emailStatus", status)
                        .bind("codeHash", codeHash)
                        .bind("expiresAt", expiresAt)
                        .bind("email", email)
                        .execute()
        ) > 0;
    }

    // Chuyển trạng thái về chưa xác nhận khi mã hết hạn
    public boolean markUnverified(String email) {
        return get().withHandle(h ->
                h.createUpdate("""
                                UPDATE users
                                SET email_status = 'UNVERIFIED',
                                    verification_code_hash = NULL,
                                    verification_expires_at = NULL
                                WHERE email = :email
                                  AND email_status = 'PENDING'
                                """)
                        .bind("email", email)
                        .execute()
        ) > 0;
    }

    // Xác nhận email nếu mã hợp lệ và chưa hết hạn
    public boolean verifyEmail(String email, String codeHash, LocalDateTime now) {
        return get().withHandle(h ->
                h.createUpdate("""
            UPDATE users
            SET email_status = 'VERIFIED',
                email_verified_at = CURRENT_TIMESTAMP,
                verification_code_hash = NULL,
                verification_expires_at = NULL
            WHERE email = :email
              AND email_status = 'PENDING'
              AND verification_code_hash = :codeHash
              AND verification_expires_at > :now
            """)
                        .bind("email", email)
                        .bind("codeHash", codeHash)
                        .bind("now", now)
                        .execute()
        ) > 0;
    }
}
