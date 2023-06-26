import { z } from "zod";
import { vendorPartPriceLeadHistorySchema } from "../../../components/ZodSchemas";
import { createTRPCRouter, publicProcedure } from "../trpc";

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
            startDate: "desc",
          },
        });
      return vendorPartPriceLeadHistory;
    }),

  createVendorPartPriceLeadHistory: publicProcedure
    .input(vendorPartPriceLeadHistorySchema)
    .mutation(async ({ input, ctx }) => {
      //await ctx.prisma.vendorPartPriceLeadHistory.deleteMany(); //dont forget
      const userId = ctx.session?.user?.id || "clfcnvujy0000mh08xv4po7oz";
      // if (!userId) {
      //   return {
      //     success: false,
      //   };
      // }
      //const partId =
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
