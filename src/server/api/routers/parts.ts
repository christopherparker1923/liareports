import type { PartTypes, Project, ProjectPart } from "@prisma/client";
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
        },
      });

      const resultOne: ProjectPartByProject = {};
      for (const item of part?.ProjectPart ?? []) {
        const key = item.project?.projectNumber;
        if (!key) continue;
        if (!resultOne[key]) {
          resultOne[key] = [] as typeof item[];
        }
        resultOne[key]?.push(item);
      }
      console.log("🚀 ~ file: parts.ts:106 ~ .query ~ resultOne:", resultOne);
      //returns this for the test part
      // {
      //   '22199': [
      //     {
      //       id: 1,
      //       manufacturerPartId: 'clfd1cdt901c6to3gaz0r8i9o',
      //       projectNumber: '22199',
      //       parentId: null,
      //       project: [Object]
      //     },
      //     {
      //       id: 2,
      //       manufacturerPartId: 'clfd1cdt901c6to3gaz0r8i9o',
      //       projectNumber: '22199',
      //       parentId: null,
      //       project: [Object]
      //     }
      //   ];
      // }
      const resultTwo: ProjectPartByProjectCount = {};
      for (const item of part?.ProjectPart ?? []) {
        const key = item.project?.projectNumber;
        if (!key) continue;
        if (!resultTwo[key]) {
          resultTwo[key] = 0;
        }
        resultTwo[key]++;
      }
      //returns this for the test part
      // { '22199': 2 }
      console.log("🚀 ~ file: parts.ts:134 ~ .query ~ resultTwo:", resultTwo);
      return part;
    })
});
type ProjectPartByProjectCount = {
  [key: string]: number;
};

type ProjectPartByProject = {
  [key: string]: (ProjectPart & { project: Project | null; })[];
};