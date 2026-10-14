-- Additive soft-hide review moderation without destroying review history.
ALTER TABLE "Review" ADD COLUMN "hidden" BOOLEAN NOT NULL DEFAULT false;
