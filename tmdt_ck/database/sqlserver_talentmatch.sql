-- Fresh SQL Server database for the TalentMatch Java application.
-- Safe to run repeatedly: it creates the database/tables if absent and never drops data.
IF DB_ID(N'TalentMatch') IS NULL
BEGIN
    CREATE DATABASE [TalentMatch];
END;
GO

USE [TalentMatch];
GO

IF OBJECT_ID(N'dbo.users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.users (
        uid INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_users PRIMARY KEY,
        name NVARCHAR(120) NOT NULL,
        email NVARCHAR(180) NOT NULL,
        [password] VARCHAR(255) NOT NULL,
        bdate DATE NULL,
        avatar NVARCHAR(500) NULL,
        role VARCHAR(20) NOT NULL,
        phone NVARCHAR(20) NULL,
        status BIT NOT NULL CONSTRAINT DF_users_status DEFAULT (1),
        email_status VARCHAR(20) NOT NULL CONSTRAINT DF_users_email_status DEFAULT ('PENDING'),
        verification_code_hash VARCHAR(255) NULL,
        verification_expires_at DATETIME2 NULL,
        email_verified_at DATETIME2 NULL,
        created_at DATETIME2 NOT NULL CONSTRAINT DF_users_created_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT UQ_users_email UNIQUE (email),
        CONSTRAINT CK_users_role CHECK (role IN ('USER','CLIENT','ADMIN','FREELANCER')),
        CONSTRAINT CK_users_email_status CHECK (email_status IN ('PENDING','VERIFIED','FAILED'))
    );
END;
GO

IF OBJECT_ID(N'dbo.profiles', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.profiles (
        user_id INT NOT NULL CONSTRAINT PK_profiles PRIMARY KEY,
        name NVARCHAR(120) NOT NULL CONSTRAINT DF_profiles_name DEFAULT (N''),
        headline NVARCHAR(150) NOT NULL CONSTRAINT DF_profiles_headline DEFAULT (N''),
        skills NVARCHAR(300) NOT NULL CONSTRAINT DF_profiles_skills DEFAULT (N''),
        bio NVARCHAR(MAX) NULL,
        portfolio NVARCHAR(500) NOT NULL CONSTRAINT DF_profiles_portfolio DEFAULT (N''),
        CONSTRAINT FK_profiles_users FOREIGN KEY (user_id) REFERENCES dbo.users(uid) ON DELETE CASCADE
    );
END;
GO

IF OBJECT_ID(N'dbo.records', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.records (
        id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_records PRIMARY KEY,
        seed_key NVARCHAR(120) NULL,
        kind VARCHAR(40) NOT NULL,
        owner_id INT NOT NULL,
        title NVARCHAR(200) NOT NULL,
        content NVARCHAR(MAX) NOT NULL,
        status VARCHAR(30) NOT NULL,
        target_email NVARCHAR(180) NULL,
        skill NVARCHAR(300) NULL,
        location NVARCHAR(150) NULL,
        due_date NVARCHAR(40) NULL,
        amount BIGINT NOT NULL CONSTRAINT DF_records_amount DEFAULT (0),
        job_id INT NULL,
        project_id INT NULL,
        rating TINYINT NOT NULL CONSTRAINT DF_records_rating DEFAULT (0),
        client_approved BIT NOT NULL CONSTRAINT DF_records_client_approved DEFAULT (0),
        freelancer_approved BIT NOT NULL CONSTRAINT DF_records_freelancer_approved DEFAULT (0),
        created_at DATETIME2 NOT NULL CONSTRAINT DF_records_created_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT FK_records_users FOREIGN KEY (owner_id) REFERENCES dbo.users(uid),
        CONSTRAINT FK_records_job FOREIGN KEY (job_id) REFERENCES dbo.records(id),
        CONSTRAINT FK_records_project FOREIGN KEY (project_id) REFERENCES dbo.records(id)
    );
    CREATE UNIQUE INDEX UX_records_seed_key ON dbo.records(seed_key) WHERE seed_key IS NOT NULL;
    CREATE INDEX IX_records_kind_status ON dbo.records(kind,status);
    CREATE INDEX IX_records_target ON dbo.records(target_email);
    CREATE INDEX IX_records_job ON dbo.records(job_id);
    CREATE INDEX IX_records_project ON dbo.records(project_id);
END;
GO
