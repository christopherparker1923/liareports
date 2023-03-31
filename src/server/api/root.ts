import { createTRPCRouter } from "./trpc";
import { partsRouter } from "./routers/parts";
import { projectsRouter } from "./routers/projects";
//These don't exist?
import { projectChildsRouter } from "./routers/projectChilds";
import { projectPartsRouter } from "./routers/projectParts";
import { manufacturerRouter } from "./routers/manufacturers";
import { vendorRouter } from "./routers/vendors";
import { vendorPartPriceLeadHistoryRouter } from "./routers/vendorPartPriceLeadHistory";
import { vendorPartsRouter } from "./routers/vendorParts";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  parts: partsRouter,
  projects: projectsRouter,
  projectParts: projectPartsRouter,
  projectChilds: projectChildsRouter,
  manufacturers: manufacturerRouter,
  vendors: vendorRouter,
  vendorParts: vendorPartsRouter,
  vendorPartPriceLeadHistory: vendorPartPriceLeadHistoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
