import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const projectPartsRouter = createTRPCRouter({
  deleteProjectPart: publicProcedure
    .input(z.number())
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
        id: z.number(),
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
});
