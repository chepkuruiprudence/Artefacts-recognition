-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'CONTRIBUTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "ArtefactCategory" AS ENUM ('KIKUYU_SPEARS', 'KIKUYU_STOOLS', 'NON_ARTEFACTS', 'KIKUYU_BEADWORK', 'KIKUYU_WALKING_STICK', 'KIKUYU_POTS', 'KIKUYU_HUTS', 'KIKUYU_COMBS', 'KIKUYU_SHIELDS', 'KIKUYU_CALABASH');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ContactSubject" AS ENUM ('GENERAL', 'CLASSIFICATION', 'CONTRIBUTION', 'PARTNERSHIP', 'TECHNICAL', 'OTHER');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artefacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ArtefactCategory" NOT NULL,
    "era" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "culturalSignificance" TEXT,
    "materials" TEXT[],
    "region" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "views" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dimensions" JSONB,
    "contributorId" TEXT,

    CONSTRAINT "artefacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artefact_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "artefactId" TEXT NOT NULL,

    CONSTRAINT "artefact_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" "ContactSubject" NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ContactStatus" NOT NULL DEFAULT 'NEW',
    "response" TEXT,
    "respondedAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classifications" (
    "id" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "topPrediction" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "allPredictions" JSONB NOT NULL,
    "processingTime" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "classifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_verificationToken_key" ON "users"("verificationToken");

-- CreateIndex
CREATE INDEX "artefacts_category_idx" ON "artefacts"("category");

-- CreateIndex
CREATE INDEX "artefacts_verificationStatus_idx" ON "artefacts"("verificationStatus");

-- CreateIndex
CREATE INDEX "contacts_status_idx" ON "contacts"("status");

-- CreateIndex
CREATE INDEX "contacts_createdAt_idx" ON "contacts"("createdAt");

-- AddForeignKey
ALTER TABLE "artefacts" ADD CONSTRAINT "artefacts_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artefact_images" ADD CONSTRAINT "artefact_images_artefactId_fkey" FOREIGN KEY ("artefactId") REFERENCES "artefacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
