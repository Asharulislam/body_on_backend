-- Rename enum value in place so existing rows with 'owner' become 'gym_owner'
ALTER TYPE "Role" RENAME VALUE 'owner' TO 'gym_owner';
