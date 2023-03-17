import type { PartTypes } from "@prisma/client";
import { z } from "zod";
import { partSchema } from "../../../components/ZodSchemas";

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
      return await ctx.prisma.manufacturerPart
        .create({
          data: {
            ...input,
            partNumber: input.partNumber,
            partType: input.partType as PartTypes,
            length: input.length,
            width: input.width,
            height: input.height,
            CSACert: input.CSACert,
            ULCert: input.ULCert,
            preference: input.preference,
            description: input.description,
            partTags: {},
            //!! this will break the record in the db, do not uncomment
            // partTags: {
            //   connectOrCreate: input.partTags.map((tag) => {
            //     return { where: { name: tag }, create: { name: tag } };
            //   }),
            // },
            image: "",
            manufacturerName: input.manufacturerName,
          },
        })
        .catch((e) => console.log(e));
    }),

  getSecretMessage: publicProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
