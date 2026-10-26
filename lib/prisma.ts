import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prefer DIRECT_URL for Prisma to avoid pgBouncer idle connection drops
const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined,
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
