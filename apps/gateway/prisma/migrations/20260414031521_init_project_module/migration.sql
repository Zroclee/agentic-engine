-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('NONE', 'API_KEY', 'DYNAMIC_TOKEN');

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "description" TEXT,
    "auth_type" "AuthType" NOT NULL DEFAULT 'NONE',
    "auth_config" TEXT,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);
