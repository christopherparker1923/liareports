import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const projectChildsRouter = createTRPCRouter({
  deleteProjectChild: publicProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.projectChild.delete({
        where: {
          id: input,
        },
      });
    }),
});
