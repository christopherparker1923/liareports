import { createTRPCRouter } from "./trpc";
import { partsRouter } from "./routers/parts";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  parts: partsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
