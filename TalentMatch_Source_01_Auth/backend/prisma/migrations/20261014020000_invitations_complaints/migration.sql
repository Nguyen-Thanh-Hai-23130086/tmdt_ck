-- Additive migration for collaboration invitations and dispute handling.
CREATE TABLE "Invitation" (
 "id" TEXT NOT NULL, "jobId" TEXT NOT NULL, "clientId" TEXT NOT NULL, "freelancerId" TEXT NOT NULL,
 "message" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'PENDING',
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Invitation_jobId_freelancerId_key" ON "Invitation"("jobId","freelancerId");
CREATE INDEX "Invitation_freelancerId_status_idx" ON "Invitation"("freelancerId","status");
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "JobPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE TABLE "Complaint" (
 "id" TEXT NOT NULL,"workspaceId" TEXT NOT NULL,"reporterId" TEXT NOT NULL,
 "detail" TEXT NOT NULL,"status" TEXT NOT NULL DEFAULT 'OPEN',"response" TEXT,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Complaint_workspaceId_createdAt_idx" ON "Complaint"("workspaceId","createdAt");
CREATE INDEX "Complaint_status_createdAt_idx" ON "Complaint"("status","createdAt");
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
