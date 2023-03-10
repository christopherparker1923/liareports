import { z } from "zod";
import { manufacturerSchema } from "../../../pages/dashboard/manufacturers";

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

  getAllManufacturerNamesParts: publicProcedure.query(async ({ ctx }) => {
    const manufacturersNamePart = await ctx.prisma.manufacturer.findMany({
      select: {
        name: true,
        manufacturerParts: true,
      },
    });
    return manufacturersNamePart;
  }),

  deleteManufacturer: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const manufacturer = await ctx.prisma.manufacturer.findFirst({
        where: {
          name: input,
        },
        include: {
          manufacturerParts: true,
        },
      });

      if (!manufacturer) {
        throw new Error(`Manufacturer with name ${input} not found`);
      }

      const partCount = await ctx.prisma.manufacturerPart.count({
        where: {
          Manufacturer: {
            name: input,
          },
        },
      });

      if (partCount > 0) {
        throw new Error(
          `Cannot delete manufacturer with associated manufacturerParts`
        );
      }

      return await ctx.prisma.manufacturer.delete({
        where: {
          name: input,
        },
      });
    }),

  createManufacturer: publicProcedure
    .input(manufacturerSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.manufacturer.create({
        data: {
          ...input,
        },
      });
    }),

  getSecretMessage: publicProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
