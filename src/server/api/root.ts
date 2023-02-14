import { createTRPCRouter } from "./trpc";
import { partsRouter } from "./routers/parts";
import { projectsRouter } from "./routers/projects";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  parts: partsRouter,
  projects: projectsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
