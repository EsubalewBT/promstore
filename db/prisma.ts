import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const extendClient = (client: PrismaClient) =>
  client.$extends({
    result: {
      product: {
        price: { compute: (p) => p.price.toString() },
        rating: { compute: (p) => p.rating.toString() },
      },
    },
  });

type ExtendedPrismaClient = ReturnType<typeof extendClient>;

let prisma: ExtendedPrismaClient;

if (process.env.NODE_ENV === "production") {
  // Production (Neon + Serverless)
  const { Pool, neonConfig } = await import("@neondatabase/serverless");
  const { PrismaNeon } = await import("@prisma/adapter-neon");
  const ws = (await import("ws")).default;

  neonConfig.webSocketConstructor = ws;

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
  });

  // Prisma's Neon adapter typing expects a PoolConfig, but the runtime accepts the Pool instance.
  // Cast to any to satisfy TypeScript while keeping the correct runtime behavior.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaNeon(pool as any);

  prisma = extendClient(new PrismaClient({ adapter }));
} else {
  // Local dev (TCP)
  prisma = extendClient(new PrismaClient());
}

export { prisma };
