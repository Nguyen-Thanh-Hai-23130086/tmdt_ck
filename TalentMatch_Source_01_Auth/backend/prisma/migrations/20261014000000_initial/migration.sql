-- Initial versioned PostgreSQL schema for TalentMatch.
CREATE TYPE "Role" AS ENUM ('CLIENT','FREELANCER','ADMIN');
CREATE TYPE "JobStatus" AS ENUM ('DRAFT','PUBLISHED','IN_PROGRESS','REVIEW','REVISION','COMPLETED','CANCELLED','DISPUTED');
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED','REVIEWING','SHORTLISTED','ACCEPTED','REJECTED','WITHDRAWN');
CREATE TYPE "MilestoneStatus" AS ENUM ('OPEN','SUBMITTED','REVISION','APPROVED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING','PAID_DEMO');

CREATE TABLE "User" (
 "id" TEXT NOT NULL,"email" TEXT NOT NULL,"passwordHash" TEXT,"fullName" TEXT NOT NULL,"role" "Role" NOT NULL,
 "avatarUrl" TEXT,"location" TEXT,"bio" TEXT,"locked" BOOLEAN NOT NULL DEFAULT false,"isDemo" BOOLEAN NOT NULL DEFAULT false,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "Session" (
 "id" TEXT NOT NULL,"tokenHash" TEXT NOT NULL,"userId" TEXT NOT NULL,"expiresAt" TIMESTAMP(3) NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE TABLE "OAuthAccount" (
 "id" TEXT NOT NULL,"provider" TEXT NOT NULL,"providerUserId" TEXT NOT NULL,"userId" TEXT NOT NULL,
 CONSTRAINT "OAuthAccount_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "OAuthAccount_provider_providerUserId_key" ON "OAuthAccount"("provider","providerUserId");
CREATE TABLE "OAuthState" (
 "stateHash" TEXT NOT NULL,"provider" TEXT NOT NULL,"role" "Role" NOT NULL,"verifier" TEXT,"expiresAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "OAuthState_pkey" PRIMARY KEY ("stateHash")
);
CREATE TABLE "FreelancerProfile" (
 "userId" TEXT NOT NULL,"headline" TEXT NOT NULL DEFAULT 'Freelancer',"hourlyRate" INTEGER NOT NULL DEFAULT 0,"experienceYears" INTEGER NOT NULL DEFAULT 0,
 "skills" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],"languages" TEXT[] NOT NULL DEFAULT ARRAY['Tiếng Việt']::TEXT[],"workMode" TEXT NOT NULL DEFAULT 'REMOTE',
 CONSTRAINT "FreelancerProfile_pkey" PRIMARY KEY ("userId")
);
CREATE TABLE "PortfolioItem" (
 "id" TEXT NOT NULL,"freelancerId" TEXT NOT NULL,"title" TEXT NOT NULL,"description" TEXT NOT NULL,"imageUrl" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "PortfolioItem_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Company" (
 "userId" TEXT NOT NULL,"name" TEXT NOT NULL,"industry" TEXT,"website" TEXT,"logoUrl" TEXT,"description" TEXT,
 CONSTRAINT "Company_pkey" PRIMARY KEY ("userId")
);
CREATE TABLE "JobPost" (
 "id" TEXT NOT NULL,"clientId" TEXT NOT NULL,"title" TEXT NOT NULL,"description" TEXT NOT NULL,"budget" INTEGER NOT NULL,
 "skills" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],"deadline" TIMESTAMP(3),"status" "JobStatus" NOT NULL DEFAULT 'PUBLISHED',"isDemo" BOOLEAN NOT NULL DEFAULT false,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "JobPost_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "JobPost_status_createdAt_idx" ON "JobPost"("status","createdAt");
CREATE INDEX "JobPost_clientId_status_idx" ON "JobPost"("clientId","status");
CREATE TABLE "Application" (
 "id" TEXT NOT NULL,"jobId" TEXT NOT NULL,"freelancerId" TEXT NOT NULL,"coverLetter" TEXT NOT NULL,"bid" INTEGER NOT NULL,"days" INTEGER NOT NULL,
 "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Application_jobId_freelancerId_key" ON "Application"("jobId","freelancerId");
CREATE INDEX "Application_freelancerId_status_idx" ON "Application"("freelancerId","status");
CREATE TABLE "Workspace" (
 "id" TEXT NOT NULL,"jobId" TEXT NOT NULL,"clientId" TEXT NOT NULL,"freelancerId" TEXT NOT NULL,"agreedBudget" INTEGER NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Workspace_jobId_key" ON "Workspace"("jobId");
CREATE TABLE "Milestone" (
 "id" TEXT NOT NULL,"workspaceId" TEXT NOT NULL,"title" TEXT NOT NULL,"description" TEXT,"amount" INTEGER NOT NULL,
 "dueAt" TIMESTAMP(3),"status" "MilestoneStatus" NOT NULL DEFAULT 'OPEN',"deliverable" TEXT,"revisionNote" TEXT,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Message" (
 "id" TEXT NOT NULL,"workspaceId" TEXT NOT NULL,"senderId" TEXT NOT NULL,"body" TEXT NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Message_workspaceId_createdAt_idx" ON "Message"("workspaceId","createdAt");
CREATE TABLE "Notification" (
 "id" TEXT NOT NULL,"userId" TEXT NOT NULL,"text" TEXT NOT NULL,"read" BOOLEAN NOT NULL DEFAULT false,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId","createdAt");
CREATE TABLE "Transaction" (
 "id" TEXT NOT NULL,"workspaceId" TEXT NOT NULL,"amount" INTEGER NOT NULL,"status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
 "reference" TEXT NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Transaction_reference_key" ON "Transaction"("reference");
CREATE TABLE "Review" (
 "id" TEXT NOT NULL,"workspaceId" TEXT NOT NULL,"authorId" TEXT NOT NULL,"targetId" TEXT NOT NULL,"rating" INTEGER NOT NULL,
 "comment" TEXT NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Review_workspaceId_authorId_key" ON "Review"("workspaceId","authorId");
CREATE TABLE "AuditLog" (
 "id" TEXT NOT NULL,"actorId" TEXT NOT NULL,"action" TEXT NOT NULL,"targetId" TEXT NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OAuthAccount" ADD CONSTRAINT "OAuthAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FreelancerProfile" ADD CONSTRAINT "FreelancerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "FreelancerProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "JobPost" ADD CONSTRAINT "JobPost_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "JobPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Application" ADD CONSTRAINT "Application_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "JobPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
