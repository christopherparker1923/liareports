import React from "react";
import type { ProjectChild, ProjectPart } from "@prisma/client";
import { api } from "../../utils/api";
import ProjectPartAutocomplete from "./ProjectPartAutocomplete";
import ProjectChildAutocomplete from "./ProjectChildAutocomplete";
import { ProjectChildren, Tree } from "../../server/api/routers/projects";

export function ProjectDetailTable({ pid }: { pid: string }) {
  const { data } = api.projects.getProjectChildrenByProjectNumber.useQuery(
    pid,
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <>
      <RecursiveTable data={data || []} pid={pid} />
      {/* <ProjectChildAutocomplete */}
      {/*   part={undefined} */}
      {/*   parentId={null} */}
      {/*   projectId={pid} */}
      {/* /> */}
    </>
  );
}
type ProjectTree =
  | Tree<
      ProjectChild & {
        projectParts: (ProjectPart & {
          manufacturerPart: {
            partNumber: string;
          };
        })[];
      }
    >
  | undefined;
function RecursiveTable({
  data,
  pid,
  parentId = null,
}: {
  data: ProjectTree;
  pid: string;
  parentId?: string | null;
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
              re
            />
            {child?.projectParts?.map((projectPart) => (
              <ProjectPartAutocomplete
                parentId={child.id}
                part={projectPart}
                projectId={pid}
                key={projectPart.id}
              />
            ))}
            <RecursiveTable
              data={child?.children}
              pid={pid}
              parentId={child.id}
            />
          </div>
        );
      })}
      <ProjectPartAutocomplete
        parentId={parentId}
        part={undefined}
        projectId={pid}
      />
      <ProjectChildAutocomplete
        part={undefined}
        parentId={parentId}
        projectId={pid}
      />
    </>
  );
}
