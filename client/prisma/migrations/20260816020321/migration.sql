/*
  Warnings:

  - Added the required column `PaymentMetodo` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('MERCADO_PAGO', 'PAGAR_ME');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "PaymentMetodo" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "qrcode" TEXT,
    "copia_cola" TEXT,
    "paymentProvide" "PaymentProvider" DEFAULT 'MERCADO_PAGO',
    "transationId" TEXT NOT NULL,
    "orderId" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
