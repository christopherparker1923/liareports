import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const projectPartsRouter = createTRPCRouter({
  deleteProjectPart: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.projectPart.delete({
        where: {
          id: input,
        },
      });
    }),

  updateProjectPartQuantities: publicProcedure
    .input(
      z.object({
        id: z.string(),
        required: z.number(),
        ordered: z.number(),
        recieved: z.number(),
        committed: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.projectPart.update({
        where: {
          id: input.id,
        },
        data: {
          quantityRequired: input.required,
          quantityOrdered: input.ordered,
          quantityRecieved: input.recieved,
          quantityCommitted: input.committed,
        },
      });
    }),

  assignVendorPartPriceHistoryToProjectPart: publicProcedure
    .input(
      z.object({
        projectPartId: z.string(),
        vendorPartPriceLeadHistoryId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.projectPart.update({
        where: {
          id: input.projectPartId,
        },
        data: {
          vendorPartPriceLeadHistoryId: input.vendorPartPriceLeadHistoryId,
        },
      });
    }),
});
