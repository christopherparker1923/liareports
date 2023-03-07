import { ChildTypes, Prisma, ProjectChild, ProjectPart } from "@prisma/client";
import { z } from "zod";
import { projectSchema } from "../../../components/ProjectForm";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const projectsRouter = createTRPCRouter({
  createProject: publicProcedure
    .input(projectSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.project.create({
        data: {
          ...input,
          createdBy: {
            connect: {
              id: "cleixyvxr0000ub9chmyznxro",
            },
          },
        },
      });
    }),

  deleteProject: publicProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.project.delete({
        where: {
          id: input,
        },
      });
    }),

  getAllProjects: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.project.findMany({
      orderBy: { projectNumber: "asc" },
    });
  }),

  getProjectChildrenById: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const projectChildren = await ctx.prisma.projectChild.findMany({
        where: {
          projectNumber: input,
        },
        include: {
          projectParts: {
            include: {
              manufacturerPart: true,
            },
          },
        },
      });
      console.log(projectChildren[0]?.projectParts);
      function buildTree(
        projectChildren: ProjectChildWithChildren[],
        parentId: number | null = null
      ) {
        const tree: ProjectChildWithChildren[] = [];
        projectChildren
          .filter((child) => child.parentId === parentId)
          .forEach((child) => {
            child.children = buildTree(projectChildren, child.id);
            tree.push(child);
          });
        return tree;
      }

      const projectSpecificParts = await ctx.prisma.projectPart.findMany({
        where: {
          projectNumber: input,
        },
        include: {
          manufacturerPart: true,
        },
      });
      console.log(projectSpecificParts);

      const partArray = buildTree(projectChildren);
      const topPartArray = projectSpecificParts
        .filter((part) => part.parentId === null) as ProjectChildWithChildren[];

      const fullArray = [...partArray, ...topPartArray].reverse();
      return fullArray;
    }),
  updateChildName: publicProcedure.input(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ).mutation(async ({ input, ctx }) => {
    return await ctx.prisma.projectChild.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
      },
    });
  }),

  addPartToProject: publicProcedure.input(
    z.object({
      projectId: z.string(),
      partId: z.string(),
      parentId: z.number().optional(),
    })).mutation(async ({ input, ctx }) => {
      const projectPart = await ctx.prisma.projectPart.create({
        data: {
          projectNumber: input.projectId,
          parentId: input.parentId,
          manufacturerPartId: input.partId,
        }
      });
      return projectPart;
    }),
  addProjectChild: publicProcedure.input(
    z.object({
      projectId: z.string(),
      childType: z.string(),
      parentId: z.number().optional(),
    })).mutation(async ({ input, ctx }) => {
      const childType: ChildTypes = input.childType as ChildTypes;
      const projectPart = await ctx.prisma.projectChild.create({
        data: {
          childType,
          name: childType,
          revision: "y",
          status: "y",
          projectNumber: input.projectId,
          parentId: input.parentId,
        }
      });
      return projectPart;
    }),

  clearProjectParts: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.projectPart.deleteMany({
        where: {
          projectNumber: input,
        },
      });
    }),
  getProjectById: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.project.findUnique({
        where: {
          projectNumber: input,
        },
      });
    }),
});

type ProjectPartWithManufacturer = Prisma.ProjectPartGetPayload<{
  include: {
    manufacturerPart: true;
  };
}>;
export interface ProjectChildWithChildren extends ProjectChild {
  children?: ProjectChildWithChildren[];
  projectParts?: ProjectPartWithManufacturer[];
};
