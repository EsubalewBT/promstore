import "dotenv/config";
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // Production (Neon + Serverless)
  const { Pool, neonConfig } = await import("@neondatabase/serverless");
  const { PrismaNeon } = await import("@prisma/adapter-neon");
  const ws = (await import("ws")).default;

  neonConfig.webSocketConstructor = ws;

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
  });

  const adapter = new PrismaNeon(pool);

  prisma = new PrismaClient({ adapter }).$extends({
    result: {
      product: {
        price: { compute: (p) => p.price.toString() },
        rating: { compute: (p) => p.rating.toString() },
      },
    },
  });
} else {
  // Local dev (TCP)
  prisma = new PrismaClient().$extends({
    result: {
      product: {
        price: { compute: (p) => p.price.toString() },
        rating: { compute: (p) => p.rating.toString() },
      },
    },
  });
}

export { prisma };
