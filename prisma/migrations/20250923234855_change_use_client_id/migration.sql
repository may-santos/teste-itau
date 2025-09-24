/*
  Warnings:

  - You are about to drop the column `aggregateId` on the `events` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_account_balances" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountId" TEXT NOT NULL,
    "balance" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "account_balances_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_account_balances" ("accountId", "balance", "createdAt", "id", "updatedAt") SELECT "accountId", "balance", "createdAt", "id", "updatedAt" FROM "account_balances";
DROP TABLE "account_balances";
ALTER TABLE "new_account_balances" RENAME TO "account_balances";
CREATE UNIQUE INDEX "account_balances_accountId_key" ON "account_balances"("accountId");
CREATE INDEX "account_balances_accountId_idx" ON "account_balances"("accountId");
CREATE TABLE "new_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "events_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_events" ("amount", "clientId", "createdAt", "id", "type") SELECT "amount", "clientId", "createdAt", "id", "type" FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";
CREATE INDEX "events_clientId_idx" ON "events"("clientId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
