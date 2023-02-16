import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const partsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAllParts: publicProcedure.query(async ({ ctx }) => {
    const parts = await ctx.prisma.manufacturerPart.findMany({
      select: {
        description: true,
        manufacturerName: true,
        partNumber: true,
      },
    });
    return parts;
  }),

  getAllPartsFull: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const parts = await ctx.prisma.manufacturerPart.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        include: { Manufacturer: true, partTags: true, ProjectPart: true },
        orderBy: { id: "asc" },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (parts.length > input.limit) {
        const nextItem = parts.pop();
        nextCursor = nextItem!.id;
      }
      return { parts, nextCursor };
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
