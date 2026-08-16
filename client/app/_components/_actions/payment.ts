"use server"

import { db } from "@/app/_lib/prisma"
import { Prisma } from "@prisma/client"

export const createPayment = async(data: Prisma.PaymentCreateInput) => {
    await db.payment.create({data})
}