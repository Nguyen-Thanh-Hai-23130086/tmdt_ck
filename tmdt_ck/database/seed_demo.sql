-- Synthetic educational accounts only; shared TEST password must be changed before real deployment.
USE talentmatch;
START TRANSACTION;
INSERT INTO users(full_name,email,password,role,status) VALUES('Nguyễn Quản Trị','admin@talentmatch.test','pbkdf2_sha256$160000$shNSwn3DMLB8Kbt/a9kZ+Q==$ka7bKaVH6porbplTqQPBCbvDFTAnq4FPshp5u0xgt5Y=','ADMIN','ACTIVE') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO users(full_name,email,password,role,status) VALUES('Doanh nghiệp mẫu 01','client01@talentmatch.test','pbkdf2_sha256$160000$cbDtsL0KmFIoa0tYYC3qtg==$1SSjSwR4W+nSK48aIBUCTPeafBDhYppvOw20N9cu/Mw=','CLIENT','ACTIVE') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO users(full_name,email,password,role,status) VALUES('Doanh nghiệp mẫu 02','client02@talentmatch.test','pbkdf2_sha256$160000$VE/Ota31HEsz2vNyXri4UA==$yHCIUfznnSzY9NrDggLictELGr9oO8LzczBjvcjtqjE=','CLIENT','ACTIVE') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO users(full_name,email,password,role,status) VALUES('Doanh nghiệp mẫu 03','client03@talentmatch.test','pbkdf2_sha256$160000$rdK4jnxNdMa37gp+Bw0Mbw==$DIHeTro/mSqIU7eK3e4Q74CvS9bAy1zGjKJp4BKQ8Hc=','CLIENT','ACTIVE') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO users(full_name,email,password,role,status) VALUES('Doanh nghiệp mẫu 04','client04@talentmatch.test','pbkdf2_sha256$160000$lz5BoTl+1QIGE2Iu/dHsTQ==$r9r4mxr8/SPrByZOliJkIpHdIEbZ2VjLWQzgu5ziS0Y=','CLIENT','ACTIVE') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO users(full_name,email,password,role,status) VALUES('Doanh nghiệp mẫu 05','client05@talentmatch.test','pbkdf2_sha256$160000$sUJ/B7GN2vH1yjE/Rblf9w==$rEFp9dxXxpGn+9dhH/lX9hFzyNjj09Zs3M4E+uf7O1s=','CLIENT','ACTIVE') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO users(full_name,email,password,role,status) VALUES('Freelancer mẫu 01','freelancer01@talentmatch.test','pbkdf2_sha256$160000$bD9KvTM/Jwj3RYZWtN9Qxw==$AmJz36ooE/kJOFCLw3Zf1KAO56IbNwBDfPmjSM+YSKk=','FREELANCER','ACTIVE') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO users(full_name,email,password,role,status) VALUES('Freelancer mẫu 02','freelancer02@talentmatch.test','pbkdf2_sha256$160000$g8/oZ3k4MYc44P8YuqW4xg==$l1LJ7BTmdabmDkqfN8O9+slHgAlMyUVleY1FzEmFb2U=','FREELANCER','ACTIVE') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO users(full_name,email,password,role,status) VALUES('Freelancer mẫu 03','freelancer03@talentmatch.test','pbkdf2_sha256$160000$dVP3JQQSQwylNUb744oDNA==$SZDk2RiCjYvXYIVDWLATMwKBUlb0iuXDpHLBHwVF2JY=','FREELANCER','ACTIVE') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO users(full_name,email,password,role,status) VALUES('Freelancer mẫu 04','freelancer04@talentmatch.test','pbkdf2_sha256$160000$wbjFhww2pLI8lAn4fgaLRQ==$kGNF5SKaxr8YTmhANyzDqLRl0fQd0LvQzX3UdS4AJgY=','FREELANCER','ACTIVE') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO users(full_name,email,password,role,status) VALUES('Freelancer mẫu 05','freelancer05@talentmatch.test','pbkdf2_sha256$160000$7Gh9DtatuoZmnx8AGAFbog==$4Wxy2xLjRLY1zFvtD4T2vxWhzfUCSHm/hLvqS/xqslU=','FREELANCER','ACTIVE') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO users(full_name,email,password,role,status) VALUES('Freelancer mẫu 06','freelancer06@talentmatch.test','pbkdf2_sha256$160000$r5LzuKw/ip10NK3wsNwIfA==$gY4d+On/RJQZ3WJRWHwKONKb5Q5Pa+bJDzXdp0G37Xk=','FREELANCER','ACTIVE') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO users(full_name,email,password,role,status) VALUES('Freelancer mẫu 07','freelancer07@talentmatch.test','pbkdf2_sha256$160000$h4V+OSgUwqfpwrMoNhq8xw==$r2+rkYPkg6WqYt2aFxdWqk5M+5rfXFaXqm2BHl7dfWk=','FREELANCER','ACTIVE') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO users(full_name,email,password,role,status) VALUES('Freelancer mẫu 08','freelancer08@talentmatch.test','pbkdf2_sha256$160000$5H7o/ohj5pGQZ8UVoPmoXQ==$T9hxT0r3qE/fOCMbrFiwIvF0lw84MFnNil/QeqRY0BM=','FREELANCER','ACTIVE') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO users(full_name,email,password,role,status) VALUES('Freelancer mẫu 09','freelancer09@talentmatch.test','pbkdf2_sha256$160000$59cYzoMn3+Cdx8obpTtyOg==$UX3SXyCMHSsr+MTBo60jmB/y6YpabqIC5J0xz0yNSi4=','FREELANCER','ACTIVE') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO users(full_name,email,password,role,status) VALUES('Freelancer mẫu 10','freelancer10@talentmatch.test','pbkdf2_sha256$160000$GUqrPhz1K8sg4d3jPx5GuA==$VpL8HrBno+o5AzvQil1xlou40DZOg6xPWeWzj2+2XVg=','FREELANCER','ACTIVE') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO users(full_name,email,password,role,status) VALUES('Freelancer mẫu 11','freelancer11@talentmatch.test','pbkdf2_sha256$160000$Dt6TcUG+Fkp39wj45X7BCg==$DW5yq1/XoaHO7EUUBRRjRmeGNyI4SaJVzt8hL8EFhrs=','FREELANCER','ACTIVE') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO users(full_name,email,password,role,status) VALUES('Freelancer mẫu 12','freelancer12@talentmatch.test','pbkdf2_sha256$160000$Zhs+CjRLVRZH3Fq+SDNABA==$jm6D3/lrl//pBVadFBOGRUYgmUp3+IGtg11HaMtq6U0=','FREELANCER','ACTIVE') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO users(full_name,email,password,role,status) VALUES('Freelancer mẫu 13','freelancer13@talentmatch.test','pbkdf2_sha256$160000$1tC6IzNeknB/UoOcAF1TLg==$GqUdpqy/FKMvP0bRFRcu2YSWTN3oh6OGSQ4k0TGiMo8=','FREELANCER','ACTIVE') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO users(full_name,email,password,role,status) VALUES('Freelancer mẫu 14','freelancer14@talentmatch.test','pbkdf2_sha256$160000$HIBB5dpy77UfYZ9xfjzeYw==$cp0cGUYPe74nhPYjn+NC0IoaWE+sp9N2OXLhkAKs+uc=','FREELANCER','ACTIVE') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) SELECT id,'Nguyễn Quản Trị','Quản trị viên','Quản trị hệ thống','Hồ sơ được tạo cho mục đích kiểm thử tính năng TalentMatch.','https://example.com/portfolio' FROM users WHERE email='admin@talentmatch.test' ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) SELECT id,'Doanh nghiệp mẫu 01','Doanh nghiệp tuyển dụng','Tuyển dụng, quản lý dự án','Hồ sơ được tạo cho mục đích kiểm thử tính năng TalentMatch.','https://example.com/portfolio' FROM users WHERE email='client01@talentmatch.test' ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) SELECT id,'Doanh nghiệp mẫu 02','Doanh nghiệp tuyển dụng','Tuyển dụng, quản lý dự án','Hồ sơ được tạo cho mục đích kiểm thử tính năng TalentMatch.','https://example.com/portfolio' FROM users WHERE email='client02@talentmatch.test' ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) SELECT id,'Doanh nghiệp mẫu 03','Doanh nghiệp tuyển dụng','Tuyển dụng, quản lý dự án','Hồ sơ được tạo cho mục đích kiểm thử tính năng TalentMatch.','https://example.com/portfolio' FROM users WHERE email='client03@talentmatch.test' ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) SELECT id,'Doanh nghiệp mẫu 04','Doanh nghiệp tuyển dụng','Tuyển dụng, quản lý dự án','Hồ sơ được tạo cho mục đích kiểm thử tính năng TalentMatch.','https://example.com/portfolio' FROM users WHERE email='client04@talentmatch.test' ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) SELECT id,'Doanh nghiệp mẫu 05','Doanh nghiệp tuyển dụng','Tuyển dụng, quản lý dự án','Hồ sơ được tạo cho mục đích kiểm thử tính năng TalentMatch.','https://example.com/portfolio' FROM users WHERE email='client05@talentmatch.test' ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) SELECT id,'Freelancer mẫu 01','Freelancer thiết kế & lập trình','React, JavaScript, HTML/CSS','Hồ sơ được tạo cho mục đích kiểm thử tính năng TalentMatch.','https://example.com/portfolio' FROM users WHERE email='freelancer01@talentmatch.test' ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) SELECT id,'Freelancer mẫu 02','Freelancer thiết kế & lập trình','React, JavaScript, HTML/CSS','Hồ sơ được tạo cho mục đích kiểm thử tính năng TalentMatch.','https://example.com/portfolio' FROM users WHERE email='freelancer02@talentmatch.test' ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) SELECT id,'Freelancer mẫu 03','Freelancer thiết kế & lập trình','React, JavaScript, HTML/CSS','Hồ sơ được tạo cho mục đích kiểm thử tính năng TalentMatch.','https://example.com/portfolio' FROM users WHERE email='freelancer03@talentmatch.test' ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) SELECT id,'Freelancer mẫu 04','Freelancer thiết kế & lập trình','React, JavaScript, HTML/CSS','Hồ sơ được tạo cho mục đích kiểm thử tính năng TalentMatch.','https://example.com/portfolio' FROM users WHERE email='freelancer04@talentmatch.test' ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) SELECT id,'Freelancer mẫu 05','Freelancer thiết kế & lập trình','React, JavaScript, HTML/CSS','Hồ sơ được tạo cho mục đích kiểm thử tính năng TalentMatch.','https://example.com/portfolio' FROM users WHERE email='freelancer05@talentmatch.test' ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) SELECT id,'Freelancer mẫu 06','Freelancer thiết kế & lập trình','React, JavaScript, HTML/CSS','Hồ sơ được tạo cho mục đích kiểm thử tính năng TalentMatch.','https://example.com/portfolio' FROM users WHERE email='freelancer06@talentmatch.test' ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) SELECT id,'Freelancer mẫu 07','Freelancer thiết kế & lập trình','React, JavaScript, HTML/CSS','Hồ sơ được tạo cho mục đích kiểm thử tính năng TalentMatch.','https://example.com/portfolio' FROM users WHERE email='freelancer07@talentmatch.test' ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) SELECT id,'Freelancer mẫu 08','Freelancer thiết kế & lập trình','React, JavaScript, HTML/CSS','Hồ sơ được tạo cho mục đích kiểm thử tính năng TalentMatch.','https://example.com/portfolio' FROM users WHERE email='freelancer08@talentmatch.test' ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) SELECT id,'Freelancer mẫu 09','Freelancer thiết kế & lập trình','React, JavaScript, HTML/CSS','Hồ sơ được tạo cho mục đích kiểm thử tính năng TalentMatch.','https://example.com/portfolio' FROM users WHERE email='freelancer09@talentmatch.test' ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) SELECT id,'Freelancer mẫu 10','Freelancer thiết kế & lập trình','React, JavaScript, HTML/CSS','Hồ sơ được tạo cho mục đích kiểm thử tính năng TalentMatch.','https://example.com/portfolio' FROM users WHERE email='freelancer10@talentmatch.test' ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) SELECT id,'Freelancer mẫu 11','Freelancer thiết kế & lập trình','React, JavaScript, HTML/CSS','Hồ sơ được tạo cho mục đích kiểm thử tính năng TalentMatch.','https://example.com/portfolio' FROM users WHERE email='freelancer11@talentmatch.test' ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) SELECT id,'Freelancer mẫu 12','Freelancer thiết kế & lập trình','React, JavaScript, HTML/CSS','Hồ sơ được tạo cho mục đích kiểm thử tính năng TalentMatch.','https://example.com/portfolio' FROM users WHERE email='freelancer12@talentmatch.test' ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) SELECT id,'Freelancer mẫu 13','Freelancer thiết kế & lập trình','React, JavaScript, HTML/CSS','Hồ sơ được tạo cho mục đích kiểm thử tính năng TalentMatch.','https://example.com/portfolio' FROM users WHERE email='freelancer13@talentmatch.test' ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO profiles(user_id,name,headline,skills,bio,portfolio) SELECT id,'Freelancer mẫu 14','Freelancer thiết kế & lập trình','React, JavaScript, HTML/CSS','Hồ sơ được tạo cho mục đích kiểm thử tính năng TalentMatch.','https://example.com/portfolio' FROM users WHERE email='freelancer14@talentmatch.test' ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-job-01','jobs',u.id,'Lập trình Java Servlet #1','Dự án mẫu cần freelancer, có mô tả công việc, thời hạn và báo giá.','OPEN',NULL,6200000,'Java, MySQL','TP.HCM',NULL,NULL
 FROM users u WHERE u.email='client01@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-job-02','jobs',u.id,'Phân tích dữ liệu tuyển dụng #2','Dự án mẫu cần freelancer, có mô tả công việc, thời hạn và báo giá.','OPEN',NULL,7400000,'SQL, Power BI','Hà Nội',NULL,NULL
 FROM users u WHERE u.email='client02@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-job-03','jobs',u.id,'Phát triển landing page #3','Dự án mẫu cần freelancer, có mô tả công việc, thời hạn và báo giá.','OPEN',NULL,8600000,'Figma','Remote',NULL,NULL
 FROM users u WHERE u.email='client03@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-job-04','jobs',u.id,'Thiết kế giao diện TalentMatch #4','Dự án mẫu cần freelancer, có mô tả công việc, thời hạn và báo giá.','OPEN',NULL,9800000,'HTML/CSS','TP.HCM',NULL,NULL
 FROM users u WHERE u.email='client04@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-job-05','jobs',u.id,'Lập trình Java Servlet #5','Dự án mẫu cần freelancer, có mô tả công việc, thời hạn và báo giá.','OPEN',NULL,11000000,'Java, MySQL','Hà Nội',NULL,NULL
 FROM users u WHERE u.email='client05@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-job-06','jobs',u.id,'Phân tích dữ liệu tuyển dụng #6','Dự án mẫu cần freelancer, có mô tả công việc, thời hạn và báo giá.','OPEN',NULL,12200000,'SQL, Power BI','Remote',NULL,NULL
 FROM users u WHERE u.email='client01@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-job-07','jobs',u.id,'Phát triển landing page #7','Dự án mẫu cần freelancer, có mô tả công việc, thời hạn và báo giá.','OPEN',NULL,13400000,'Figma','TP.HCM',NULL,NULL
 FROM users u WHERE u.email='client02@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-job-08','jobs',u.id,'Thiết kế giao diện TalentMatch #8','Dự án mẫu cần freelancer, có mô tả công việc, thời hạn và báo giá.','OPEN',NULL,14600000,'HTML/CSS','Hà Nội',NULL,NULL
 FROM users u WHERE u.email='client03@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-job-09','jobs',u.id,'Lập trình Java Servlet #9','Dự án mẫu cần freelancer, có mô tả công việc, thời hạn và báo giá.','OPEN',NULL,15800000,'Java, MySQL','Remote',NULL,NULL
 FROM users u WHERE u.email='client04@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-job-10','jobs',u.id,'Phân tích dữ liệu tuyển dụng #10','Dự án mẫu cần freelancer, có mô tả công việc, thời hạn và báo giá.','OPEN',NULL,17000000,'SQL, Power BI','TP.HCM',NULL,NULL
 FROM users u WHERE u.email='client05@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-app-01','applications',u.id,'Proposal ứng tuyển công việc #1','Tôi có kỹ năng phù hợp và đề xuất tiến độ ba tuần.','PENDING','client01@talentmatch.test',4000000,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-job-01') x),NULL
 FROM users u WHERE u.email='freelancer01@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-app-02','applications',u.id,'Proposal ứng tuyển công việc #2','Tôi có kỹ năng phù hợp và đề xuất tiến độ ba tuần.','PENDING','client02@talentmatch.test',4500000,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-job-02') x),NULL
 FROM users u WHERE u.email='freelancer02@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-app-03','applications',u.id,'Proposal ứng tuyển công việc #3','Tôi có kỹ năng phù hợp và đề xuất tiến độ ba tuần.','PENDING','client03@talentmatch.test',5000000,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-job-03') x),NULL
 FROM users u WHERE u.email='freelancer03@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-app-04','applications',u.id,'Proposal ứng tuyển công việc #4','Tôi có kỹ năng phù hợp và đề xuất tiến độ ba tuần.','PENDING','client04@talentmatch.test',5500000,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-job-04') x),NULL
 FROM users u WHERE u.email='freelancer04@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-app-05','applications',u.id,'Proposal ứng tuyển công việc #5','Tôi có kỹ năng phù hợp và đề xuất tiến độ ba tuần.','PENDING','client05@talentmatch.test',6000000,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-job-05') x),NULL
 FROM users u WHERE u.email='freelancer05@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-app-06','applications',u.id,'Proposal ứng tuyển công việc #6','Tôi có kỹ năng phù hợp và đề xuất tiến độ ba tuần.','PENDING','client01@talentmatch.test',6500000,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-job-06') x),NULL
 FROM users u WHERE u.email='freelancer06@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-app-07','applications',u.id,'Proposal ứng tuyển công việc #7','Tôi có kỹ năng phù hợp và đề xuất tiến độ ba tuần.','PENDING','client02@talentmatch.test',7000000,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-job-07') x),NULL
 FROM users u WHERE u.email='freelancer07@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-app-08','applications',u.id,'Proposal ứng tuyển công việc #8','Tôi có kỹ năng phù hợp và đề xuất tiến độ ba tuần.','PENDING','client03@talentmatch.test',7500000,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-job-08') x),NULL
 FROM users u WHERE u.email='freelancer08@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-app-09','applications',u.id,'Proposal ứng tuyển công việc #9','Tôi có kỹ năng phù hợp và đề xuất tiến độ ba tuần.','PENDING','client04@talentmatch.test',8000000,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-job-09') x),NULL
 FROM users u WHERE u.email='freelancer09@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-app-10','applications',u.id,'Proposal ứng tuyển công việc #10','Tôi có kỹ năng phù hợp và đề xuất tiến độ ba tuần.','PENDING','client05@talentmatch.test',8500000,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-job-10') x),NULL
 FROM users u WHERE u.email='freelancer10@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-app-11','applications',u.id,'Proposal ứng tuyển công việc #1','Tôi có kỹ năng phù hợp và đề xuất tiến độ ba tuần.','PENDING','client01@talentmatch.test',9000000,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-job-01') x),NULL
 FROM users u WHERE u.email='freelancer11@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-app-12','applications',u.id,'Proposal ứng tuyển công việc #2','Tôi có kỹ năng phù hợp và đề xuất tiến độ ba tuần.','PENDING','client02@talentmatch.test',9500000,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-job-02') x),NULL
 FROM users u WHERE u.email='freelancer12@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-app-13','applications',u.id,'Proposal ứng tuyển công việc #3','Tôi có kỹ năng phù hợp và đề xuất tiến độ ba tuần.','PENDING','client03@talentmatch.test',10000000,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-job-03') x),NULL
 FROM users u WHERE u.email='freelancer13@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-app-14','applications',u.id,'Proposal ứng tuyển công việc #4','Tôi có kỹ năng phù hợp và đề xuất tiến độ ba tuần.','PENDING','client04@talentmatch.test',10500000,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-job-04') x),NULL
 FROM users u WHERE u.email='freelancer14@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-invite-01','invitations',u.id,'Lời mời dự án #1','Mời trao đổi và nhận dự án thiết kế.','PENDING','freelancer01@talentmatch.test',0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client01@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-agreement-01','agreements',u.id,'Thỏa thuận hợp tác #1','Điều khoản và các lần bàn giao trong khuôn khổ demo.','DRAFT','freelancer01@talentmatch.test',8000000,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client01@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-project-01','projects',u.id,'Dự án mẫu #1','Gồm hai mốc công việc và nghiệm thu.','IN_PROGRESS','freelancer01@talentmatch.test',16000000,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client01@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-invite-02','invitations',u.id,'Lời mời dự án #2','Mời trao đổi và nhận dự án thiết kế.','PENDING','freelancer02@talentmatch.test',0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client02@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-agreement-02','agreements',u.id,'Thỏa thuận hợp tác #2','Điều khoản và các lần bàn giao trong khuôn khổ demo.','DRAFT','freelancer02@talentmatch.test',9000000,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client02@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-project-02','projects',u.id,'Dự án mẫu #2','Gồm hai mốc công việc và nghiệm thu.','IN_PROGRESS','freelancer02@talentmatch.test',17000000,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client02@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-invite-03','invitations',u.id,'Lời mời dự án #3','Mời trao đổi và nhận dự án thiết kế.','PENDING','freelancer03@talentmatch.test',0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client03@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-agreement-03','agreements',u.id,'Thỏa thuận hợp tác #3','Điều khoản và các lần bàn giao trong khuôn khổ demo.','DRAFT','freelancer03@talentmatch.test',10000000,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client03@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-project-03','projects',u.id,'Dự án mẫu #3','Gồm hai mốc công việc và nghiệm thu.','IN_PROGRESS','freelancer03@talentmatch.test',18000000,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client03@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-invite-04','invitations',u.id,'Lời mời dự án #4','Mời trao đổi và nhận dự án thiết kế.','PENDING','freelancer04@talentmatch.test',0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client04@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-agreement-04','agreements',u.id,'Thỏa thuận hợp tác #4','Điều khoản và các lần bàn giao trong khuôn khổ demo.','DRAFT','freelancer04@talentmatch.test',11000000,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client04@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-project-04','projects',u.id,'Dự án mẫu #4','Gồm hai mốc công việc và nghiệm thu.','IN_PROGRESS','freelancer04@talentmatch.test',19000000,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client04@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-invite-05','invitations',u.id,'Lời mời dự án #5','Mời trao đổi và nhận dự án thiết kế.','PENDING','freelancer05@talentmatch.test',0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client05@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-agreement-05','agreements',u.id,'Thỏa thuận hợp tác #5','Điều khoản và các lần bàn giao trong khuôn khổ demo.','DRAFT','freelancer05@talentmatch.test',12000000,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client05@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-project-05','projects',u.id,'Dự án mẫu #5','Gồm hai mốc công việc và nghiệm thu.','IN_PROGRESS','freelancer05@talentmatch.test',20000000,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client05@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-milestone-1-1','milestones',u.id,'Mốc 1 dự án #1','Bàn giao tài liệu thiết kế và mã nguồn demo.','SUBMITTED','freelancer01@talentmatch.test',5000000,NULL,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-project-01') x)
 FROM users u WHERE u.email='client01@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-milestone-1-2','milestones',u.id,'Mốc 2 dự án #1','Bàn giao tài liệu thiết kế và mã nguồn demo.','IN_PROGRESS','freelancer01@talentmatch.test',5000000,NULL,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-project-01') x)
 FROM users u WHERE u.email='client01@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-message-1','messages',u.id,'Trao đổi dự án #1','Xin chào, chúng ta sẽ triển khai mốc đầu tiên.','SENT','freelancer01@talentmatch.test',0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client01@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-payment-1','payments',u.id,'Theo dõi thanh toán dự án #1','Bản ghi theo dõi, không có giao dịch tiền thật.','PENDING','freelancer01@talentmatch.test',5000000,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client01@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-review-1','reviews',u.id,'Đánh giá dự án #1','Hợp tác tốt, phản hồi đúng hẹn.','PUBLISHED','freelancer01@talentmatch.test',0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client01@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-report-1','reports',u.id,'Hỗ trợ dự án #1','Cần hỗ trợ xác nhận thời hạn dự án.','OPEN','client01@talentmatch.test',0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='freelancer01@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-milestone-2-1','milestones',u.id,'Mốc 1 dự án #2','Bàn giao tài liệu thiết kế và mã nguồn demo.','SUBMITTED','freelancer02@talentmatch.test',5000000,NULL,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-project-02') x)
 FROM users u WHERE u.email='client02@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-milestone-2-2','milestones',u.id,'Mốc 2 dự án #2','Bàn giao tài liệu thiết kế và mã nguồn demo.','IN_PROGRESS','freelancer02@talentmatch.test',5000000,NULL,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-project-02') x)
 FROM users u WHERE u.email='client02@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-message-2','messages',u.id,'Trao đổi dự án #2','Xin chào, chúng ta sẽ triển khai mốc đầu tiên.','SENT','freelancer02@talentmatch.test',0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client02@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-payment-2','payments',u.id,'Theo dõi thanh toán dự án #2','Bản ghi theo dõi, không có giao dịch tiền thật.','PENDING','freelancer02@talentmatch.test',5000000,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client02@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-review-2','reviews',u.id,'Đánh giá dự án #2','Hợp tác tốt, phản hồi đúng hẹn.','PUBLISHED','freelancer02@talentmatch.test',0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client02@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-report-2','reports',u.id,'Hỗ trợ dự án #2','Cần hỗ trợ xác nhận thời hạn dự án.','OPEN','client02@talentmatch.test',0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='freelancer02@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-milestone-3-1','milestones',u.id,'Mốc 1 dự án #3','Bàn giao tài liệu thiết kế và mã nguồn demo.','SUBMITTED','freelancer03@talentmatch.test',5000000,NULL,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-project-03') x)
 FROM users u WHERE u.email='client03@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-milestone-3-2','milestones',u.id,'Mốc 2 dự án #3','Bàn giao tài liệu thiết kế và mã nguồn demo.','IN_PROGRESS','freelancer03@talentmatch.test',5000000,NULL,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-project-03') x)
 FROM users u WHERE u.email='client03@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-message-3','messages',u.id,'Trao đổi dự án #3','Xin chào, chúng ta sẽ triển khai mốc đầu tiên.','SENT','freelancer03@talentmatch.test',0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client03@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-payment-3','payments',u.id,'Theo dõi thanh toán dự án #3','Bản ghi theo dõi, không có giao dịch tiền thật.','PENDING','freelancer03@talentmatch.test',5000000,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client03@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-review-3','reviews',u.id,'Đánh giá dự án #3','Hợp tác tốt, phản hồi đúng hẹn.','PUBLISHED','freelancer03@talentmatch.test',0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client03@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-report-3','reports',u.id,'Hỗ trợ dự án #3','Cần hỗ trợ xác nhận thời hạn dự án.','OPEN','client03@talentmatch.test',0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='freelancer03@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-milestone-4-1','milestones',u.id,'Mốc 1 dự án #4','Bàn giao tài liệu thiết kế và mã nguồn demo.','SUBMITTED','freelancer04@talentmatch.test',5000000,NULL,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-project-04') x)
 FROM users u WHERE u.email='client04@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-milestone-4-2','milestones',u.id,'Mốc 2 dự án #4','Bàn giao tài liệu thiết kế và mã nguồn demo.','IN_PROGRESS','freelancer04@talentmatch.test',5000000,NULL,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-project-04') x)
 FROM users u WHERE u.email='client04@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-message-4','messages',u.id,'Trao đổi dự án #4','Xin chào, chúng ta sẽ triển khai mốc đầu tiên.','SENT','freelancer04@talentmatch.test',0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client04@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-payment-4','payments',u.id,'Theo dõi thanh toán dự án #4','Bản ghi theo dõi, không có giao dịch tiền thật.','PENDING','freelancer04@talentmatch.test',5000000,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client04@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-review-4','reviews',u.id,'Đánh giá dự án #4','Hợp tác tốt, phản hồi đúng hẹn.','PUBLISHED','freelancer04@talentmatch.test',0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client04@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-report-4','reports',u.id,'Hỗ trợ dự án #4','Cần hỗ trợ xác nhận thời hạn dự án.','OPEN','client04@talentmatch.test',0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='freelancer04@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-milestone-5-1','milestones',u.id,'Mốc 1 dự án #5','Bàn giao tài liệu thiết kế và mã nguồn demo.','SUBMITTED','freelancer05@talentmatch.test',5000000,NULL,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-project-05') x)
 FROM users u WHERE u.email='client05@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-milestone-5-2','milestones',u.id,'Mốc 2 dự án #5','Bàn giao tài liệu thiết kế và mã nguồn demo.','IN_PROGRESS','freelancer05@talentmatch.test',5000000,NULL,NULL,NULL,(SELECT id FROM (SELECT id FROM records WHERE seed_key='seed-project-05') x)
 FROM users u WHERE u.email='client05@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-message-5','messages',u.id,'Trao đổi dự án #5','Xin chào, chúng ta sẽ triển khai mốc đầu tiên.','SENT','freelancer05@talentmatch.test',0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client05@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-payment-5','payments',u.id,'Theo dõi thanh toán dự án #5','Bản ghi theo dõi, không có giao dịch tiền thật.','PENDING','freelancer05@talentmatch.test',5000000,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client05@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-review-5','reviews',u.id,'Đánh giá dự án #5','Hợp tác tốt, phản hồi đúng hẹn.','PUBLISHED','freelancer05@talentmatch.test',0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='client05@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-report-5','reports',u.id,'Hỗ trợ dự án #5','Cần hỗ trợ xác nhận thời hạn dự án.','OPEN','client05@talentmatch.test',0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='freelancer05@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'category-Lập trình web','categories',u.id,'Lập trình web','Kỹ năng và danh mục minh họa.','ACTIVE',NULL,0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='admin@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'category-Thiết kế UI/UX','categories',u.id,'Thiết kế UI/UX','Kỹ năng và danh mục minh họa.','ACTIVE',NULL,0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='admin@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'category-Dữ liệu và BI','categories',u.id,'Dữ liệu và BI','Kỹ năng và danh mục minh họa.','ACTIVE',NULL,0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='admin@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'category-Marketing số','categories',u.id,'Marketing số','Kỹ năng và danh mục minh họa.','ACTIVE',NULL,0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='admin@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'category-Viết nội dung','categories',u.id,'Viết nội dung','Kỹ năng và danh mục minh họa.','ACTIVE',NULL,0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='admin@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-premium-Premium Freelancer','premium',u.id,'Premium Freelancer','Chế độ minh họa, chưa tích hợp thanh toán hay thông báo thật.','AVAILABLE',NULL,99000,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='admin@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-premium-Premium Client','premium',u.id,'Premium Client','Chế độ minh họa, chưa tích hợp thanh toán hay thông báo thật.','AVAILABLE',NULL,199000,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='admin@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-policies-Điều khoản demo','policies',u.id,'Điều khoản demo','Chế độ minh họa, chưa tích hợp thanh toán hay thông báo thật.','PUBLISHED',NULL,0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='admin@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-notifications-Chào mừng','notifications',u.id,'Chào mừng','Chế độ minh họa, chưa tích hợp thanh toán hay thông báo thật.','UNREAD',NULL,0,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='admin@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
INSERT INTO records(seed_key,kind,owner_id,title,content,status,target_email,amount,skill,location,job_id,project_id)
 SELECT 'seed-credits-Điểm hoạt động','credits',u.id,'Điểm hoạt động','Chế độ minh họa, chưa tích hợp thanh toán hay thông báo thật.','PENDING',NULL,100,NULL,NULL,NULL,NULL
 FROM users u WHERE u.email='admin@talentmatch.test' ON DUPLICATE KEY UPDATE seed_key=seed_key;
COMMIT;
