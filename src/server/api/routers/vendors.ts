import { z } from "zod";
import { vendorSchema } from "../../../components/ZodSchemas";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const vendorRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAllVendors: publicProcedure.query(async ({ ctx }) => {
    const vendors = await ctx.prisma.vendor.findMany({
      select: {
        name: true,
        vendorParts: true,
        id: true,
      },
    });
    return vendors;
  }),

  deleteVendor: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const vendor = await ctx.prisma.vendor.findFirst({
        where: {
          name: input,
        },
        include: {
          vendorParts: true,
        },
      });

      if (!vendor) {
        throw new Error(`Vendor with name ${input} not found`);
      }

      const partCount = await ctx.prisma.vendorPart.count({
        where: {
          Vendor: {
            name: input,
          },
        },
      });

      if (partCount > 0) {
        throw new Error(`Cannot delete vendor with associated vendorParts`);
      }

      return await ctx.prisma.vendor.delete({
        where: {
          name: input,
        },
      });
    }),

  createVendor: publicProcedure
    .input(vendorSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.vendor.create({
        data: {
          ...input,
        },
      });
    }),

  getSecretMessage: publicProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
