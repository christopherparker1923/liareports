import { Prisma, ProjectChild, ProjectPart } from "@prisma/client";
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
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const projectChildren = await ctx.prisma.projectChild.findMany({
        where: {
          projectId: input,
        },
        include: {
          projectParts: {
            include: {
              manufacturerPart: true
            },
          },
        },

      });

      function buildTree(projectChildren: ProjectChildWithChildren[], parentId: number | null = null) {
        const tree: ProjectChildWithChildren[] = [];
        projectChildren
          .filter(child => child.parentId === parentId)
          .forEach(child => {
            child.children = buildTree(projectChildren, child.id);
            tree.push(child);
          });
        return tree;
      }
      return buildTree(projectChildren);
    })
});

type ProjectPartWithManufacturer = Prisma.ProjectPartGetPayload<{
  include: {
    manufacturerPart: true;
  };
}>;
interface ProjectChildWithChildren extends ProjectChild {
  children?: ProjectChildWithChildren[];
  projectParts?: ProjectPartWithManufacturer[];
}