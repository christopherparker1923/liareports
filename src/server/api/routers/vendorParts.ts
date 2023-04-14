import { z } from "zod";
import { vendorPartSchema } from "../../../components/VendorAddPartAutocomplete";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const vendorPartsRouter = createTRPCRouter({
  addVendorPart: publicProcedure
    .input(vendorPartSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.vendorPart.create({
        data: {
          Vendor: {
            connectOrCreate: {
              where: {
                name: input.vendorName,
              },
              create: {
                name: input.vendorName,
                //needs other fields
              },
            },
          },
          ManufacturerPart: {
            connect: {
              id: input.manufacturerPartId,
            },
          },
        },
      });
    }),

  getAllVendorParts: publicProcedure.query(async ({ ctx }) => {
    const vendorParts = await ctx.prisma.vendor.findMany({});
    return vendorParts;
  }),

  getVendorIdByVendorNameAndPartNumber: publicProcedure
    .input(
      z.object({
        vendorName: z.string(),
        partNumber: z.string(),
        manuName: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const vendor = await ctx.prisma.vendorPart.findFirst({
        where: {
          Vendor: {
            name: input.vendorName,
          },
          AND: {
            ManufacturerPart: {
              manufacturerName: input.manuName,
              partNumber: input.partNumber,
            },
          },
        },
        select: {
          id: true,
          VendorPartPriceLeadHistory: true,
        },
      });
      return vendor;
    }),

  getVendorPartsByVendor: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const vendorPartsByVendor = await ctx.prisma.vendorPart.findMany({
        where: {
          vendorId: input,
        },
        include: {
          ManufacturerPart: true,
          VendorPartPriceLeadHistory: true,
        },
      });
      return vendorPartsByVendor;
    }),

  getVendorsWhoSellPart: publicProcedure
    .input(
      z.object({
        partNumber: z.string(),
        manuName: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const vendors = await ctx.prisma.vendorPart.findMany({
        where: {
          ManufacturerPart: {
            manufacturerName: input.manuName,
            partNumber: input.partNumber,
          },
        },
        include: {
          Vendor: true,
        },
      });
      return vendors;
    }),

  getVendorPartsOfManuPart: publicProcedure
    .input(
      z.object({
        partNumber: z.string(),
        manuName: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const vendorParts = await ctx.prisma.vendorPart.findMany({
        where: {
          ManufacturerPart: {
            manufacturerName: input.manuName,
            partNumber: input.partNumber,
          },
        },
        include: {
          Vendor: true,
          VendorPartPriceLeadHistory: true,
        },
      });
      return vendorParts;
    }),
});
