/*
  Warnings:

  - A unique constraint covering the columns `[accountId]` on the table `account_balances` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "account_balances_accountId_key" ON "account_balances"("accountId");
