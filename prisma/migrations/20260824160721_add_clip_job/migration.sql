-- CreateTable
CREATE TABLE "ClipJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clipId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "logTail" TEXT,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClipJob_clipId_fkey" FOREIGN KEY ("clipId") REFERENCES "Clip" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ClipJob_clipId_key" ON "ClipJob"("clipId");

-- CreateIndex
CREATE INDEX "ClipJob_status_createdAt_idx" ON "ClipJob"("status", "createdAt");
