import { z } from "zod";
import { vendorPartSchema } from "../../../pages/dashboard/vendors";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const vendorPartsRouter = createTRPCRouter({
  addVendorPart: publicProcedure
    .input(vendorPartSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.vendorPart.create({
        data: {
          ...input,
        },
      });
    }),

  getAllVendorParts: publicProcedure.query(async ({ ctx }) => {
    const vendorParts = await ctx.prisma.vendor.findMany({});
    return vendorParts;
  }),

  getVendorPartsByVendor: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const vendorPartsByVendor = await ctx.prisma.vendorPart.findMany({
        where: {
          vendorId: input,
        },
      });
      return vendorPartsByVendor;
    }),
});
