import { PrismaClient } from '@/app/generated/prisma/client';
import {PrismaMariaDb} from "@prisma/adapter-mariadb"
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapterMaria = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
})

const adapterPg = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter: adapterMaria });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
