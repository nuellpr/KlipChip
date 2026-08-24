-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'magic_link',
    "role" TEXT NOT NULL DEFAULT 'user',
    "balanceClips" INTEGER NOT NULL DEFAULT 0,
    "avatarUrl" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Clip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "externalId" TEXT NOT NULL DEFAULT '',
    "videoTitle" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL DEFAULT '',
    "sourceDurationSec" INTEGER NOT NULL DEFAULT 0,
    "startSeconds" REAL NOT NULL,
    "endSeconds" REAL NOT NULL,
    "duration" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'preview',
    "captionsJson" TEXT NOT NULL DEFAULT '[]',
    "captionConfigJson" TEXT NOT NULL DEFAULT '{}',
    "language" TEXT NOT NULL DEFAULT 'auto',
    "layout" TEXT NOT NULL DEFAULT 'auto',
    "subtitleSource" TEXT NOT NULL DEFAULT 'auto',
    "outputFilename" TEXT,
    "priceIdr" INTEGER NOT NULL DEFAULT 500,
    "renderProgress" INTEGER NOT NULL DEFAULT 0,
    "renderStep" TEXT,
    "rating" INTEGER,
    "feedbackText" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "Clip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "clipId" TEXT,
    "packageCode" TEXT,
    "creditAmount" INTEGER,
    "amountIdr" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "providerReference" TEXT NOT NULL,
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Payment_clipId_fkey" FOREIGN KEY ("clipId") REFERENCES "Clip" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_clipId_key" ON "Payment"("clipId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_providerReference_key" ON "Payment"("providerReference");

