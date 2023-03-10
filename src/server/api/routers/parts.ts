import { PartTag } from "@prisma/client";
import { z } from "zod";
import { partSchema } from "../../../components/PartsTable";

import { createTRPCRouter, publicProcedure } from "../trpc";

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
        id: true,
      },
    });
    return parts;
  }),

  getAllPartsFull: publicProcedure
    .input(
      z.object({
        pageSize: z.number().min(1).max(100),
        pageIndex: z.number().min(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const parts = await ctx.prisma.manufacturerPart.findMany({
        skip: input.pageSize * input.pageIndex,
        take: input.pageSize,
        include: {
          Manufacturer: true,
          partTags: true,
          ProjectPart: true,
        },
        orderBy: { id: "asc" },
      });

      const pageMax = Math.ceil(
        (await ctx.prisma.manufacturerPart.count()) / input.pageSize
      );
      return { parts, pageMax };
    }),

  createPart: publicProcedure
    .input(partSchema)
    .mutation(async ({ input, ctx }) => {
      console.log("createPartCalled");
      return await ctx.prisma.manufacturerPart
        .create({
          data: {
            ...input,
            partNumber: input.partNumber,
            partType: input.partType,
            length: input.length,
            width: input.width,
            height: input.height,
            CSACert: input.CSACert,
            ULCert: input.ULCert,
            preference: input.preference,
            description: input.description,
            partTags: {
              connectOrCreate: input.partTags.map((tag) => ({
                where: { name: tag },
                create: tag,
              })),
            },
            image: "",
            manufacturerName: input.partType,
          },
        })
        .catch((e) => console.log(e));
    }),

  getSecretMessage: publicProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
