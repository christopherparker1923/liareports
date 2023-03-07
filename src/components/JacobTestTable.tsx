import React, { HTMLAttributes, HTMLProps, useEffect, useMemo } from "react";

import { api } from "../utils/api";

import { Accordion, Autocomplete } from "@mantine/core";
import { ProjectChildWithChildren } from "../server/api/routers/projects";
import {
  ChildTypes,
  ManufacturerPart,
  ProjectChild,
  ProjectPart,
} from "@prisma/client";
import { set } from "zod";

const childrenType = Object.values(ChildTypes);
function ProjectChildAutocomplete({
  part,
  placeholder,
  parentId,
  projectId,
  style,
}: {
  part: ProjectChild;
  placeholder?: string;
  parentId: number | undefined | null;
  projectId: string;
  style?: React.CSSProperties;
}) {
  console.log("🚀 ~ file: JacobTestTable.tsx:24 ~ part:", part);
  const [value, setValue] = React.useState<ChildTypes | string>(
    part.name || ""
  );
  const [name, setName] = React.useState<string | undefined>(part.name);
  const utils = api.useContext();
  const { mutate: updateProjectChild } =
    api.projects.updateChildName.useMutation();
  const { mutate } = api.projects.addProjectChild.useMutation({
    onSuccess: async () => {
      await utils.projects.getProjectChildrenById.refetch(projectId);
    },
  });
  const handleNewProjectChild = (value: string) => {
    if (!projectId) return;
    mutate({
      childType: value,
      parentId: parentId || undefined,
      projectId,
    });
    setValue("");
  };

  return (
    <div className="flex ">
      {part.name && (
        <div className="flex items-center">
          <input
            type="text"
            className="mr-2 border border-zinc-700 bg-transparent p-2"
            value={name}
            placeholder="Name"
            onBlur={() => {
              if (!name) return;
              updateProjectChild({
                id: part.id,
                name,
              });
            }}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
      )}
      <Autocomplete
        className="w-full"
        maxDropdownHeight={300}
        value={value}
        onChange={(value) => handleNewProjectChild(value)}
        placeholder={placeholder || "Part number"}
        limit={50}
        style={style}
        data={
          childrenType?.map((type) => ({
            value: type,
          })) || []
        }
        filter={(value, item) => {
          return true;
        }}
      />
    </div>
  );
}
function ProjectPartAutocomplete({
  part,
  placeholder,
  parentId,
  style,
  projectId,
}: {
  part: ProjectPart & { manufacturerPart?: ManufacturerPart };
  placeholder?: string;
  parentId: number | undefined | null;
  style?: React.CSSProperties;
  projectId: string;
}) {
  const [value, setValue] = React.useState(
    part.manufacturerPart?.partNumber || ""
  );

  const { data } = api.parts.getAllParts.useQuery();
  const utils = api.useContext();
  const { mutate } = api.projects.addPartToProject.useMutation({
    onSuccess: async () => {
      await utils.projects.getProjectChildrenById.refetch(projectId);
    },
  });
  function handleNewProjectPart(value: string) {
    const newPart = data?.find((part) => part.partNumber === value);
    if (!newPart) return;
    const payload = {
      partId: newPart?.id,
      parentId: parentId || undefined,
      projectId: projectId,
    };
    mutate(payload);

    setValue("");
  }
  return (
    <Autocomplete
      className="w-full"
      maxDropdownHeight={300}
      value={value}
      onChange={(value) => handleNewProjectPart(value)}
      placeholder={placeholder || "Part number"}
      limit={50}
      style={style}
      data={
        data?.map((part) => ({
          value: part.partNumber || "No Description",
          id: part.id,
        })) || []
      }
      filter={(value, item) => {
        return true;
      }}
    />
  );
}

export function JacobTestTable({ pid }: { pid: string }) {
  const { data } = api.projects.getProjectChildrenById.useQuery(pid);

  return (
    <>
      <RecursiveTable data={data || []} pid={pid} />
    </>
  );
}

function RecursiveTable({
  data,
  pid,
  parentId = null,
}: {
  data: ProjectChildWithChildren[];
  pid: string;
  parentId?: number | null;
}) {
  if (!data) return null;
  return (
    <>
      <div>
        {!parentId && data.filter((item) => !item.children).length === 0 && (
          <ProjectPartAutocomplete part={{}} projectId={pid} />
        )}
        {data.map((item, index) => (
          <>
            <div key={item.id}>
              {item.children || data.length === 0 ? (
                <>
                  <ProjectChildAutocomplete
                    part={item}
                    parentId={item.id}
                    projectId={pid}
                  />
                </>
              ) : (
                <>
                  {
                    <ProjectPartAutocomplete
                      part={item}
                      parentId={item.parentId}
                      projectId={pid}
                    />
                  }
                </>
              )}
              {item && !item.children && data[index + 1]?.children && (
                <ProjectPartAutocomplete
                  part={{}}
                  parentId={item.parentId}
                  projectId={pid}
                  placeholder="Empty Part One"
                />
              )}
              <div style={{ marginLeft: 20 }}>
                {item.projectParts?.length > 0
                  ? item.projectParts.map((projectPart) => (
                      <>
                        <ProjectPartAutocomplete
                          part={projectPart}
                          placeholder="projectPart"
                          parentId={item.parentId}
                          projectId={pid}
                        />
                      </>
                    ))
                  : item.children && (
                      <ProjectPartAutocomplete
                        part={{}}
                        placeholder="Empty Part Two"
                        parentId={item.id}
                        projectId={pid}
                      />
                    )}
                {item.children && item.projectParts.length > 0 && (
                  <ProjectPartAutocomplete
                    part={{}}
                    placeholder="Empty Part Three"
                    parentId={item.id}
                    projectId={pid}
                  />
                )}

                {item.children ? (
                  <RecursiveTable
                    data={item.children}
                    pid={pid}
                    parentId={pid}
                  />
                ) : null}
              </div>
            </div>
          </>
        ))}
        <ProjectChildAutocomplete
          part={{}}
          placeholder="Child #2"
          projectId={pid}
          parentId={data[data.length - 1]?.parentId}
        />
      </div>
    </>
  );
}
