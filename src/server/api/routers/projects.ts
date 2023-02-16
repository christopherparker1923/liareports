import { z } from "zod";
import { projectSchema } from "../../../components/ProjectForm";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const projectsRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(projectSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.project.create({
        data: {
          ...input,
          createdBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  deleteProject: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.project.delete({
        where: {
          id: input,
        },
      });
    }),

  getAllProjects: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.project.findMany({
      orderBy: { projectNumber: "asc" },
    });
  }),

  getProjectById: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.project.findUnique({
        where: {
          projectNumber: input,
        },
        include: {
          projectParts: true,
          ProjectChilds: {
            include: {
              projectChilds: true,
              ProjectParts: true,
            }
          },
        }
      });
    }),
});
