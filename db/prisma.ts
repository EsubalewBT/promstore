import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const globalForPrisma = global as unknown as { prisma: any };

const prismaClientSingleton = () => {
  if (process.env.NODE_ENV === 'production') {
    // --------------------------------------------------------
    // PRODUCTION MODE (Vercel)
    // --------------------------------------------------------
    
    // @ts-ignore
    const { Pool, neonConfig } = require('@neondatabase/serverless');
    // @ts-ignore
    const { PrismaNeon } = require('@prisma/adapter-neon');
    // @ts-ignore
    const ws = require('ws');

    neonConfig.webSocketConstructor = ws;
    
    const connectionString = process.env.DATABASE_URL;

    // @ts-ignore
    const pool = new Pool({ connectionString });
    // @ts-ignore
    const adapter = new PrismaNeon(pool);

    return new PrismaClient({ adapter }).$extends({
      result: {
        product: {
          price: { compute: (p) => p.price.toString() },
          rating: { compute: (p) => p.rating.toString() },
        },
      },
    });
  } else {
    // --------------------------------------------------------
    // DEVELOPMENT MODE (Localhost)
    // --------------------------------------------------------
    return new PrismaClient().$extends({
      result: {
        product: {
          price: { compute: (p) => p.price.toString() },
          rating: { compute: (p) => p.rating.toString() },
        },
      },
    });
  }
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;