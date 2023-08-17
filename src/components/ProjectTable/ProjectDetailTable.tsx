import React, { useMemo, useState } from "react";
import type { Prisma, ProjectChild, ProjectPart } from "@prisma/client";
import { api } from "../../utils/api";
import ProjectPartAutocomplete from "./ProjectPartAutocomplete";
import ProjectChildAutocomplete from "./ProjectChildAutocomplete";
import { Tree } from "../../server/api/routers/projects";

type ProjectChildWithHistory = Prisma.ProjectChildGetPayload<{
  include: {
    projectParts: {
      include: {
        vendorPartPriceLeadHistory: true;
        manufacturerPart: {
          select: {
            partNumber: true;
            manufacturerName: true;
            description: true;
            VendorPart: {
              select: {
                VendorPartPriceLeadHistory: {
                  orderBy: {
                    startDate: "desc";
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}> & {
  children: ProjectChildWithHistory[];
};
type ProjectPartWithHistory = Prisma.ProjectPartGetPayload<{
  include: {
    vendorPartPriceLeadHistory: true;
    manufacturerPart: {
      select: {
        partNumber: true;
        manufacturerName: true;
        description: true;
        VendorPart: {
          select: {
            VendorPartPriceLeadHistory: {
              orderBy: {
                startDate: "desc";
              };
            };
          };
        };
      };
    };
  };
}>;
export function ProjectDetailTable({
  pid,
  sortBy,
  totalCost,
  updateTotalCost,
}: {
  pid: string;
  sortBy: string;
  totalCost: number;
  updateTotalCost: (cost: number) => void;
}) {
  const { data } = api.projects.getProjectChildrenByProjectNumber.useQuery(
    pid,
    {
      refetchOnWindowFocus: false,
    }
  );

  const totalPrice = useMemo(() => {
    function sumPart(part: ProjectPartWithHistory): number {
      const newest = part.vendorPartPriceLeadHistory?.price ?? 0;
      // part.manufacturerPart?.VendorPart[0]?.VendorPartPriceLeadHistory[0]
      //   ?.price ?? 0;

      // part.manufacturerPart.VendorPart.forEach((vp) => {
      //   if (vp.VendorPartPriceLeadHistory[0]?.price ?? 0 > newest)
      //     newest = vp.VendorPartPriceLeadHistory[0]?.price ?? 0;
      // });
      return newest * part.quantityRequired;
    }
    function parseTree(
      branch: ProjectChildWithHistory | ProjectPartWithHistory
    ): number {
      if ("name" in branch) {
        const childSum = branch.children.reduce((acc, child) => {
          return acc + parseTree(child);
        }, 0);
        const partSum = branch.projectParts.reduce((acc, part) => {
          return acc + sumPart(part);
        }, 0);
        return partSum + childSum;
      } else {
        return sumPart(branch);
      }
    }
    const rootPartCost = data?.rootParts.reduce((acc, child) => {
      return acc + sumPart(child);
    }, 0);

    const treeCost = data?.tree.reduce((acc, child) => {
      if (!child.children) return acc;
      return acc + parseTree(child as ProjectChildWithHistory);
    }, 0);
    updateTotalCost((rootPartCost ?? 0) + (treeCost ?? 0));
  }, [data]);
  if (!data) return null;

  const { rootParts, tree } = data;

  return (
    <>
      {rootParts.map((part) => {
        return (
          <ProjectPartAutocomplete
            key={part.id}
            parentId={undefined}
            part={part}
            projectId={pid}
            sortBy={sortBy}
          />
        );
      })}
      <RecursiveTable data={tree || []} pid={pid} sortBy={sortBy} />
      <div></div>
    </>
  );
}
type ProjectTree =
  | Tree<
      ProjectChild & {
        projectParts: (ProjectPart & {
          manufacturerPart: {
            partNumber: string;
            manufacturerName: string;
          };
        })[];
      }
    >
  | undefined;
function RecursiveTable({
  data,
  pid,
  parentId = null,
  sortBy,
}: {
  data: ProjectTree;
  pid: string;
  parentId?: string | null;
  sortBy: string;
}) {
  if (!data) return null;

  return (
    <>
      {data.map((child) => {
        return (
          <div key={child.id} className={`${parentId ? "ml-8" : ""}`}>
            <ProjectChildAutocomplete
              part={child}
              parentId={parentId}
              projectId={pid}
            />
            {child?.projectParts?.map((projectPart) => (
              <ProjectPartAutocomplete
                parentId={child.id}
                part={projectPart}
                projectId={pid}
                key={projectPart.id}
                sortBy={sortBy}
              />
            ))}
            <RecursiveTable
              data={child?.children}
              pid={pid}
              parentId={child.id}
              sortBy={sortBy}
            />
          </div>
        );
      })}
      <ProjectPartAutocomplete
        parentId={parentId}
        part={undefined}
        projectId={pid}
        sortBy={sortBy}
      />
      <ProjectChildAutocomplete
        part={undefined}
        parentId={parentId}
        projectId={pid}
      />
    </>
  );
}
