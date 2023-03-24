import { Sorting } from "@tanstack/react-table";
import { z } from "zod";
import { vendorSchema } from "../../../components/ZodSchemas";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const vendorRouter = createTRPCRouter({
  getAllVendors: publicProcedure.query(async ({ ctx }) => {
    const vendors = await ctx.prisma.vendor.findMany({
      select: {
        name: true,
        vendorParts: {
          include: {
            ManufacturerPart: true,
          },
        },
        id: true,
      },
    });
    return vendors;
  }),

  getAllVendorInfo: publicProcedure.query(async ({ ctx }) => {
    const vendors = await ctx.prisma.vendor.findMany({
      include: {
        vendorParts: {
          include: {
            VendorPartPriceLeadHistory: {
              select: { price: true },
              orderBy: { startDate: "desc" },
            },
            ManufacturerPart: {
              select: {
                partNumber: true,
                manufacturerName: true,
                description: true,
              },
            },
          },
        },
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
});
