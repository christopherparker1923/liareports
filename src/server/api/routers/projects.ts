import type {
  ChildTypes,
  Prisma,
  ProjectChild,
  ProjectPart,
} from "@prisma/client";
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
              id: ctx.session?.user?.id,
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

  getProjectChildrenByProjectNumber: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const projectChildren = await ctx.prisma.projectChild.findMany({
        where: {
          projectNumber: input,
        },
        include: {
          projectParts: {
            include: {
              vendorPartPriceLeadHistory: true,
              manufacturerPart: {
                select: {
                  partNumber: true,
                  manufacturerName: true,
                  description: true,
                  VendorPart: {
                    select: {
                      VendorPartPriceLeadHistory: {
                        orderBy: {
                          startDate: "desc",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          parentId: "desc",
        },
      });

      const rootParts = await ctx.prisma.projectPart.findMany({
        where: {
          AND: [{ projectNumber: input }, { parentId: null }],
        },
        include: {
          vendorPartPriceLeadHistory: true,
          manufacturerPart: {
            select: {
              partNumber: true,
              manufacturerName: true,
              description: true,
              VendorPart: {
                select: {
                  VendorPartPriceLeadHistory: {
                    orderBy: {
                      startDate: "desc",
                    },
                  },
                },
              },
            },
          },
        },
      });
      const tree = buildTree(projectChildren, input);
      return { rootParts, tree };
    }),
  upsertChild: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        childType: z.string(),
        parentId: z.string().optional().nullish(),
        projectNumber: z.string(),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const childType: ChildTypes = input.childType as ChildTypes;
      const id = input.id;
      return await ctx.prisma.projectChild.upsert({
        where: {
          id: id || "",
        },
        update: {
          childType: childType,
          name: input.name,
          parentId: input.parentId,
          projectNumber: input.projectNumber,
        },
        create: {
          childType: childType,
          name: input.name || childType,
          parentId: input.parentId,
          projectNumber: input.projectNumber,
          revision: "y",
          status: "y",
        },
      });
    }),

  updateChildName: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.projectChild.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
    }),

  addPartToProject: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        partId: z.string(),
        parentId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!input.partId) return;

      const projectPart = await ctx.prisma.projectPart.upsert({
        create: {
          projectNumber: input.projectId,
          parentId: input.parentId,
          manufacturerPartId: input.partId,
        },
        update: {
          projectNumber: input.projectId,
          parentId: input.parentId,
          manufacturerPartId: input.partId,
        },
        where: {
          id: input.partId,
        },
      });
      return projectPart;
    }),

  removePartFromProject: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        partId: z.string(),
        parentId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const projectPart = await ctx.prisma.projectPart.create({
        data: {
          projectNumber: input.projectId,
          parentId: input.parentId,
          manufacturerPartId: input.partId,
        },
      });
      return projectPart;
    }),

  addProjectChild: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        childType: z.string(),
        parentId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const childType: ChildTypes = input.childType as ChildTypes;
      const projectPart = await ctx.prisma.projectChild.create({
        data: {
          childType,
          name: childType,
          revision: "y",
          status: "y",
          projectNumber: input.projectId,
          parentId: input.parentId,
        },
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
        include: {
          createdBy: true,
        },
      });
    }),
});
export type ProjectChildren = Prisma.ProjectChildGetPayload<{
  include: {
    projectParts: true;
  };
}>;
export type TreeNode<T> = T & { children?: Tree<T> } & ProjectChildren;
export type Tree<T> = TreeNode<T>[];

export function setdefault<K extends PropertyKey, T>(
  obj: { [key in K]: T },
  prop: K,
  fallback: T
): T {
  if (!(prop in obj)) {
    obj[prop] = fallback;
  }
  return obj[prop];
}

function buildTree<T extends ProjectChild & { projectParts: ProjectPart[] }>(
  projects: T[],
  projectNumber: string
) {
  const byParentId = {} as { [key: string]: Tree<T> };
  const rootId = projectNumber;
  for (const project of projects) {
    const id = project.parentId ?? rootId;
    setdefault(byParentId, id, [] as Tree<T>).push(project);
  }
  //root are those with null as parentId
  // if (!(rootId in byParentId)) {
  //   throw new Error("no root projects");
  // }

  function buildBranch(parentId: string) {
    if (!(parentId in byParentId)) {
      return [] as Tree<T>;
    }
    const branch = byParentId[parentId];

    if (!branch) return [] as Tree<T>;
    for (const project of branch) {
      project.children = buildBranch(project.id);
    }
    return branch;
  }

  return buildBranch(rootId);
}
