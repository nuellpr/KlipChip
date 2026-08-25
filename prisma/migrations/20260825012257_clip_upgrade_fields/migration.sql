-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Clip" (
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
    "bilingualSubtitles" BOOLEAN NOT NULL DEFAULT false,
    "secondaryLanguage" TEXT NOT NULL DEFAULT 'en',
    "socialSummary" TEXT NOT NULL DEFAULT '',
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
INSERT INTO "new_Clip" ("captionConfigJson", "captionsJson", "channelName", "completedAt", "createdAt", "duration", "endSeconds", "externalId", "feedbackText", "id", "language", "layout", "name", "outputFilename", "platform", "priceIdr", "rating", "renderProgress", "renderStep", "sourceDurationSec", "sourceUrl", "startSeconds", "status", "subtitleSource", "thumbnailUrl", "userId", "videoTitle") SELECT "captionConfigJson", "captionsJson", "channelName", "completedAt", "createdAt", "duration", "endSeconds", "externalId", "feedbackText", "id", "language", "layout", "name", "outputFilename", "platform", "priceIdr", "rating", "renderProgress", "renderStep", "sourceDurationSec", "sourceUrl", "startSeconds", "status", "subtitleSource", "thumbnailUrl", "userId", "videoTitle" FROM "Clip";
DROP TABLE "Clip";
ALTER TABLE "new_Clip" RENAME TO "Clip";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
