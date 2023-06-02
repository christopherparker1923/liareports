import { PartTags, PartTypes } from "@prisma/client";
import { z } from "zod";
import { partSchema } from "../../../components/ZodSchemas";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const partsRouter = createTRPCRouter({
  getMostRecentPriceLeadHistory: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const history = await ctx.prisma.manufacturerPart.findMany({
        where: {
          id: input,
        },
        include: {
          VendorPart: {
            include: {
              VendorPartPriceLeadHistory: true,
              Vendor: true,
            },
          },
        },
      });
      return history;
    }),

  getAllParts: publicProcedure.query(async ({ ctx }) => {
    const parts = await ctx.prisma.manufacturerPart.findMany({
      include: {
        partTags: true,
      },
    });
    return parts;
  }),

  getQueriedPartsFull: publicProcedure
    .input(
      z.object({
        pageSize: z.number().min(1).max(100),
        pageIndex: z.number().min(0),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const partTags = [] as PartTags[];
      Object.keys(PartTags).forEach((partTag) => {
        if (partTag.toLowerCase().includes(input.search?.toLowerCase() ?? ""))
          partTags.push(partTag as PartTags);
      });

      const partTypes = [] as PartTypes[];
      Object.keys(PartTypes).forEach((partType) => {
        if (partType.toLowerCase().includes(input.search?.toLowerCase() ?? ""))
          partTypes.push(partType as PartTypes);
      });

      const parts = await ctx.prisma.manufacturerPart.findMany({
        skip: input.pageSize * input.pageIndex,
        take: input.pageSize,
        where: {
          OR: [
            {
              description: {
                contains: input.search,
              },
            },
            {
              manufacturerName: {
                contains: input.search,
              },
            },
            {
              partNumber: {
                contains: input.search,
              },
            },
            {
              partTags: {
                some: {
                  name: {
                    in: partTags,
                  },
                },
              },
            },
            {
              partType: {
                in: partTypes,
              },
            },
          ],
        },
        include: {
          Manufacturer: true,
          partTags: true,
          ProjectPart: true,
        },
        orderBy: {
          partNumber: "asc",
        },
      });

      const pageMax = Math.ceil(
        (await ctx.prisma.manufacturerPart.count()) / input.pageSize
      );
      return { parts, pageMax };
    }),

  createPart: publicProcedure
    .input(partSchema)
    .mutation(async ({ input, ctx }) => {
      const createdPart = await ctx.prisma.manufacturerPart.create({
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
          partTags: {
            connect: input.partTags.map((tag) => ({ name: tag })),
          },
          image: "",
          manufacturerName: input.manufacturerName,
        },
      });
      return createdPart;
    }),

  getManuPartFromNumberAndManu: publicProcedure
    .input(
      z.object({
        partNumber: z.string(),
        manuName: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const part = await ctx.prisma.manufacturerPart.findFirst({
        where: {
          manufacturerName: input.manuName,
          partNumber: input.partNumber,
        },
        include: {
          ProjectPart: {
            include: {
              project: true,
            },
          },
          partTags: {},
        },
      });

      const resultTwo: ProjectPartByProjectCount = {};
      for (const item of part?.ProjectPart ?? []) {
        const key = item.project?.projectNumber;
        if (!key) continue;
        if (!resultTwo[key]) {
          resultTwo[key] = {
            count: 0,
            lead: item.project?.projectLead || "",
          };
        }
        resultTwo[key]!.count++;
      }
      console.log("🚀 ~ file: parts.ts:134 ~ .query ~ resultTwo:", resultTwo);
      return {
        projectPartCounts: resultTwo,
        part: part,
      };
    }),

  importParts: publicProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          part: partSchema,
        })
      )
    )
    .mutation(async ({ ctx, input: inputArray }) => {
      await Promise.all(
        inputArray.map(async (input) => {
          const { id: id, part: part } = input;
          return await ctx.prisma.manufacturerPart.upsert({
            create: {
              partNumber: part.partNumber,
              partType: part.partType as PartTypes,
              length: part.length,
              width: part.width,
              height: part.height,
              CSACert: part.CSACert,
              ULCert: part.ULCert,
              preference: part.preference,
              description: part.description,
              partTags: {
                connect: part.partTags.map((tag) => ({ name: tag })),
              },
              image: "",
              manufacturerName: part.manufacturerName,
            },
            update: {
              partNumber: part.partNumber,
              partType: part.partType as PartTypes,
              length: part.length,
              width: part.width,
              height: part.height,
              CSACert: part.CSACert,
              ULCert: part.ULCert,
              preference: part.preference,
              description: part.description,
              partTags: {
                connect: part.partTags.map((tag) => ({ name: tag })),
              },
              image: "",
              manufacturerName: part.manufacturerName,
            },
            where: {
              id: id,
              // manufacturerName_partNumber: {
              //   manufacturerName: row[0]!,
              //   partNumber: row[1]!,
              // },
            },
          });
        })
      );
    }),
});
type ProjectPartByProjectCount = {
  [key: string]: { count: number; lead: string };
};

// type ProjectPartByProject = {
//   [key: string]: (ProjectPart & { project: Project | null })[];
// };
