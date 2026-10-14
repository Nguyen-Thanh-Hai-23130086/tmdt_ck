-- Store the authenticated account id for explicit OAuth linking.
ALTER TABLE "OAuthState" ADD COLUMN "linkUserId" TEXT;
