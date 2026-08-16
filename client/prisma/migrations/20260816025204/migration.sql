/*
  Warnings:

  - You are about to drop the column `PaymentMetodo` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "PaymentMetodo",
ADD COLUMN     "paymentMetodo" TEXT;
