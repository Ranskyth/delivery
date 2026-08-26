/* eslint-disable no-unused-vars */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
  var cachedPrisma: PrismaClient;
}

const adapterMaria = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
})
const adapterPg = new PrismaPg({ connectionString: process.env.DATABASE_URL })

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ adapter: adapterMaria });
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient({ adapter: adapterMaria });
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;
