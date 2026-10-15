-- TalentMatch / MySQL 8.0+; additive baseline, never DROP tables or existing data.
-- Back up your existing database before applying; inspect schema before running against legacy tables.
CREATE DATABASE IF NOT EXISTS talentmatch CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE talentmatch;
CREATE TABLE IF NOT EXISTS users (
 id INT AUTO_INCREMENT PRIMARY KEY,
 full_name VARCHAR(120) NOT NULL,
 email VARCHAR(180) NOT NULL UNIQUE,
 password VARCHAR(255) NOT NULL COMMENT 'PBKDF2-SHA256; no plaintext passwords',
 role ENUM('ADMIN','CLIENT','FREELANCER') NOT NULL,
 status ENUM('ACTIVE','SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Group leader's users table may exist without status. Add the missing column only when needed.
SET @status_present=(SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='users' AND COLUMN_NAME='status');
SET @status_ddl=IF(@status_present=0,"ALTER TABLE users ADD COLUMN status ENUM('ACTIVE','SUSPENDED') NOT NULL DEFAULT 'ACTIVE'","SELECT 1");
PREPARE tm_stmt FROM @status_ddl; EXECUTE tm_stmt; DEALLOCATE PREPARE tm_stmt;
CREATE TABLE IF NOT EXISTS profiles (
 user_id INT PRIMARY KEY,
 name VARCHAR(120) DEFAULT '',
 headline VARCHAR(150) DEFAULT '',
 skills VARCHAR(300) DEFAULT '',
 bio TEXT,
 portfolio VARCHAR(500) DEFAULT '',
 CONSTRAINT fk_profiles_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS records (
 id INT AUTO_INCREMENT PRIMARY KEY,
 seed_key VARCHAR(120) UNIQUE NULL,
 kind VARCHAR(40) NOT NULL,
 owner_id INT NOT NULL,
 title VARCHAR(200) NOT NULL,
 content TEXT NOT NULL,
 status VARCHAR(30) NOT NULL,
 target_email VARCHAR(180) NULL,
 skill VARCHAR(300) NULL,
 location VARCHAR(150) NULL,
 due_date VARCHAR(40) NULL,
 amount BIGINT NOT NULL DEFAULT 0,
 job_id INT NULL,
 project_id INT NULL,
 rating TINYINT DEFAULT 0,
 client_approved BOOLEAN NOT NULL DEFAULT FALSE,
 freelancer_approved BOOLEAN NOT NULL DEFAULT FALSE,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_records_owner FOREIGN KEY(owner_id) REFERENCES users(id),
 CONSTRAINT fk_records_job FOREIGN KEY(job_id) REFERENCES records(id) ON DELETE SET NULL,
 CONSTRAINT fk_records_project FOREIGN KEY(project_id) REFERENCES records(id) ON DELETE SET NULL,
 INDEX ix_records_kind_status(kind,status),INDEX ix_records_target(target_email),INDEX ix_records_job(job_id),INDEX ix_records_project(project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
