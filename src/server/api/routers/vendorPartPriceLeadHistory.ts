import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const vendorPartPriceLeadHistorySchema = z.object({
  startDate: z.date({ required_error: "Required" }),
  endDate: z.date().optional(),
  price: z.number({ required_error: "Required" }).min(0),
  leadTime: z.number({ required_error: "Required" }).min(0),
  vendorPartId: z.string({ required_error: "Required" }),
});

export const vendorPartPriceLeadHistoryRouter = createTRPCRouter({
  getVendorPartHistory: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const vendorPartPriceLeadHistory =
        await ctx.prisma.vendorPartPriceLeadHistory.findMany({
          where: {
            vendorPartId: input,
          },
          orderBy: {
            startDate: "asc",
          },
        });
      return vendorPartPriceLeadHistory;
    }),

  createVendorPartPriceLeadHistory: publicProcedure
    .input(vendorPartPriceLeadHistorySchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user.id;
      if (!userId) {
        return {
          success: false,
        };
      }
      return await ctx.prisma.vendorPartPriceLeadHistory.create({
        data: {
          userId: userId,
          ...input,
        },
      });
    }),

  // deleteVendor: publicProcedure
  //   .input(z.string())
  //   .mutation(async ({ input, ctx }) => {
  //     const vendor = await ctx.prisma.vendor.findFirst({
  //       where: {
  //         name: input,
  //       },
  //       include: {
  //         vendorParts: true,
  //       },
  //     });

  //     if (!vendor) {
  //       throw new Error(`Vendor with name ${input} not found`);
  //     }

  //     const partCount = await ctx.prisma.vendorPart.count({
  //       where: {
  //         Vendor: {
  //           name: input,
  //         },
  //       },
  //     });

  //     if (partCount > 0) {
  //       throw new Error(`Cannot delete vendor with associated vendorParts`);
  //     }

  //     return await ctx.prisma.vendor.delete({
  //       where: {
  //         name: input,
  //       },
  //     });
  //   }),

  getSecretMessage: publicProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
