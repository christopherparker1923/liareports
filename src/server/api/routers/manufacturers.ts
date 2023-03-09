import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const manufacturerRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAllManufacturerNames: publicProcedure.query(async ({ ctx }) => {
    const manufacturers = await ctx.prisma.manufacturer.findMany({
      select: {
        name: true,
      },
    });
    return manufacturers;
  }),

  getSecretMessage: publicProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
