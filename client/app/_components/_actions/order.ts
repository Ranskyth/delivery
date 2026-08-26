"use server";

import { db } from "@/app/_lib/prisma";
import { Prisma } from "@prisma/client";

import { revalidatePath } from "next/cache";

export const createOrder = async (data: Prisma.OrderCreateInput) => {
  console.log("data:", data)
  await db.order.create({ data });
  revalidatePath("/my-orders");
};
