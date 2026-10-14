-- Additive migration: preserve all existing accounts and user data.
ALTER TABLE "User" ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);
-- Preserve login for accounts created before email-verification was introduced.
UPDATE "User" SET "emailVerifiedAt" = CURRENT_TIMESTAMP WHERE "passwordHash" IS NOT NULL;
CREATE TABLE "EmailToken" (
 "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "tokenHash" TEXT NOT NULL,
 "purpose" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "EmailToken_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "EmailToken_tokenHash_key" ON "EmailToken"("tokenHash");
CREATE INDEX "EmailToken_userId_purpose_idx" ON "EmailToken"("userId","purpose");
ALTER TABLE "EmailToken" ADD CONSTRAINT "EmailToken_userId_fkey"
 FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
