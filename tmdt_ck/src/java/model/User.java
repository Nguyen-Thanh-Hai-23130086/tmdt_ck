package model;

import java.io.Serializable;
import java.time.LocalDateTime;

public class User implements Serializable {
    private int uid;
    private String name;
    private String email;
    private String password;
    private String bdate;
    private String avatar;
    private String role;
    private String phone;
    private boolean status;

    //====== XÁC THỰC EMAIL ======
    private String emailStatus;
    private String verificationCodeHash;
    private LocalDateTime verificationExpiresAt;
    private LocalDateTime emailVerifiedAt;

    public User() {
    }

    public User(int uid, String name, String email, String password,
                String address, String bdate, String avatar,
                String role, String phone, boolean status) {
        this.uid = uid;
        this.name = name;
        this.email = email;
        this.password = password;
        this.bdate = bdate;
        this.avatar = avatar;
        this.role = role;
        this.phone = phone;
        this.status = status;
    }

    //====== GETTER / SETTER ======
    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getBdate() {
        return bdate;
    }

    public void setBdate(String bdate) {
        this.bdate = bdate;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    //====== EMAIL STATUS ======
    public String getEmailStatus() {
        return emailStatus;
    }

    public void setEmailStatus(String emailStatus) {
        this.emailStatus = emailStatus;
    }

    //====== VERIFICATION CODE HASH ======
    public String getVerificationCodeHash() {
        return verificationCodeHash;
    }

    public void setVerificationCodeHash(String verificationCodeHash) {
        this.verificationCodeHash = verificationCodeHash;
    }

    //====== VERIFICATION EXPIRES AT ======
    public LocalDateTime getVerificationExpiresAt() {
        return verificationExpiresAt;
    }

    public void setVerificationExpiresAt(LocalDateTime verificationExpiresAt) {
        this.verificationExpiresAt = verificationExpiresAt;
    }

    //====== EMAIL VERIFIED AT ======
    public LocalDateTime getEmailVerifiedAt() {
        return emailVerifiedAt;
    }

    public void setEmailVerifiedAt(LocalDateTime emailVerifiedAt) {
        this.emailVerifiedAt = emailVerifiedAt;
    }
}