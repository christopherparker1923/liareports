import { z } from "zod";
import { vendorPartSchema } from "../../../components/VendorAddPartAutocomplete";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const vendorPartsRouter = createTRPCRouter({
  addVendorPart: publicProcedure
    .input(vendorPartSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.vendorPartPriceLeadHistory.deleteMany();
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
