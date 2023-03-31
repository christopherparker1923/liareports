import React from "react";
import { api } from "../utils/api";
import { Autocomplete, Button, NumberInput, Text } from "@mantine/core";
import type { ProjectChildWithChildren } from "../server/api/routers/projects";
import { ChildTypes } from "@prisma/client";
import type {
  ManufacturerPart,
  ProjectChild,
  ProjectPart,
} from "@prisma/client";

const childrenType = Object.values(ChildTypes);
function ProjectChildAutocomplete({
  part,
  placeholder,
  parentId,
  projectId,
  style,
}: {
  part?: ProjectChild;
  placeholder?: string;
  parentId: number | undefined | null;
  projectId: string;
  style?: React.CSSProperties;
}) {
  const [value, setValue] = React.useState<ChildTypes | string>(
    part?.name || ""
  );
  const [name, setName] = React.useState<string | undefined>(part?.name);
  const utils = api.useContext();
  const { mutate: updateProjectChild } =
    api.projects.updateChildName.useMutation();
  const { mutate } = api.projects.addProjectChild.useMutation({
    onSuccess: async () => {
      await utils.projects.getProjectChildrenById.refetch(projectId);
    },
  });
  const { mutate: deleteProjectChild } =
    api.projectChilds.deleteProjectChild.useMutation({
      onSuccess: async () => {
        await utils.projects.getProjectChildrenById.refetch(projectId);
      },
    });

  const handleNewProjectChild = (value: string) => {
    console.log("🚀 ~ file: JacobTestTable.tsx:28 ~ parentId:", parentId);
    if (!projectId) return;
    mutate({
      childType: value,
      parentId: parentId || undefined,
      projectId,
    });
    setValue("");
  };

  return (
    <div className="flex w-2/5">
      {part?.name && (
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
        filter={() => {
          return true;
        }}
      />
      {part?.id && (
        <Button
          sx={(theme) => ({
            color:
              theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[2],
            },
          })}
          className="border border-gray-500"
          onClick={() => deleteProjectChild(part.id)}
        >
          Remove
        </Button>
      )}
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
  part?: ProjectPart & { manufacturerPart?: ManufacturerPart };
  placeholder?: string;
  parentId?: number | undefined | null;
  style?: React.CSSProperties;
  projectId: string;
}) {
  const [value, setValue] = React.useState(
    part?.manufacturerPart?.partNumber || ""
  );
  const [partQuantities, setPartQuantities] = React.useState({
    required: part?.quantityRequired || 1,
    ordered: part?.quantityOrdered || 0,
    recieved: part?.quantityRecieved || 0,
    committed: part?.quantityCommitted || 0,
  });

  const { data } = api.parts.getAllParts.useQuery();
  const utils = api.useContext();
  const { mutate } = api.projects.addPartToProject.useMutation({
    onSuccess: async () => {
      await utils.projects.getProjectChildrenById.refetch(projectId);
    },
  });
  const { mutate: updateProjectPartQuantities } =
    api.projectParts.updateProjectPartQuantities.useMutation({
      onSuccess: async () => {
        await utils.projects.getProjectChildrenById.refetch(projectId);
      },
    });
  const { mutate: deleteProjectPart } =
    api.projectParts.deleteProjectPart.useMutation({
      onSuccess: async () => {
        await utils.projects.getProjectChildrenById.refetch(projectId);
      },
    });

  function handleQuantityChange() {
    console.log("handling");
    if (!part?.id) return;
    console.log("handled");
    updateProjectPartQuantities({
      id: part.id,
      required: partQuantities.required,
      ordered: partQuantities.ordered,
      recieved: partQuantities.recieved,
      committed: partQuantities.committed,
    });
  }

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

  console.log(part?.id);
  return (
    <>
      <div className="my-1 flex w-full justify-between gap-x-1" key={part?.id}>
        <div className="flex w-2/5 flex-row">
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
                description: part.description,
              })) || []
            }
            filter={() => {
              return true;
            }}
          />
          {part?.id && (
            <>
              <Button
                sx={(theme) => ({
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[0]
                      : theme.black,

                  "&:hover": {
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[8]
                        : theme.colors.gray[2],
                  },
                })}
                className="border border-gray-500"
                onClick={() => deleteProjectPart(part.id)}
              >
                Remove
              </Button>
            </>
          )}
        </div>
        <div className="flex flex-row gap-x-1" key={part?.id}>
          {part?.id && (
            <>
              <NumberInput
                min={0}
                value={partQuantities.required}
                onChange={(e) =>
                  setPartQuantities({
                    ...partQuantities,
                    required: e || 1,
                  })
                }
                // THIS IS HOW TO DO IT !
                wrapperProps={{ onBlur: handleQuantityChange }}
                className="w-20"
                noClampOnBlur={true}
              />
              <NumberInput
                min={0}
                value={partQuantities.ordered}
                onChange={(e) =>
                  setPartQuantities({
                    ...partQuantities,
                    ordered: e || 0,
                  })
                }
                wrapperProps={{ onBlur: handleQuantityChange }}
                className="w-20"
                noClampOnBlur={true}
              />
              <NumberInput
                min={0}
                value={partQuantities.recieved}
                onChange={(e) =>
                  setPartQuantities({
                    ...partQuantities,
                    recieved: e || 0,
                  })
                }
                wrapperProps={{ onBlur: handleQuantityChange }}
                className="w-20"
                noClampOnBlur={true}
              />
              <NumberInput
                min={0}
                value={partQuantities.committed}
                onChange={(e) =>
                  setPartQuantities({
                    ...partQuantities,
                    committed: e || 0,
                  })
                }
                wrapperProps={{ onBlur: handleQuantityChange }}
                className="w-20"
                noClampOnBlur={true}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export function ProjectDetailTable({ pid }: { pid: string }) {
  const { data } = api.projects.getProjectChildrenById.useQuery(pid);

  return (
    <>
      <RecursiveTable data={data || []} pid={pid} />
    </>
  );
}

export type DataArrType = (ProjectChildWithChildren &
  (ProjectPart & { manufacturerPart?: ManufacturerPart }))[];

function RecursiveTable({
  data,
  pid,
  parentId = null,
}: {
  data: DataArrType;
  pid: string;
  parentId?: number | null;
}) {
  if (!data) return null;

  return (
    <div>
      {
        !parentId && data.filter((item) => !item.children).length === 0 && (
          <ProjectPartAutocomplete projectId={pid} />
        )
        // && (
        //   <ProjectPartAutocomplete
        //     projectId={pid}
        //     placeholder="project scope empty"
        //   />
        // )
      }
      {data.map((item, index) => {
        return (
          <div key={item.id}>
            {item.children || data.length === 0 ? (
              <>
                <ProjectChildAutocomplete
                  part={item}
                  parentId={item.id}
                  projectId={pid}
                />
                <Text>{item.id}</Text>
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
                parentId={item.parentId}
                projectId={pid}
                placeholder="Empty Part One"
              />
            )}
            <div style={{ marginLeft: 20 }} key={1000000 + item.id}>
              {item?.projectParts?.length ?? 0 > 0
                ? item?.projectParts?.map((projectPart) => (
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
                      placeholder="Empty Part Two"
                      parentId={item.id}
                      projectId={pid}
                    />
                  )}
              {item.children && (item?.projectParts?.length ?? 0) > 0 && (
                <ProjectPartAutocomplete
                  placeholder="Empty Part Three"
                  parentId={item.id}
                  projectId={pid}
                />
              )}

              {item.children ? (
                <RecursiveTable
                  data={item.children as DataArrType}
                  pid={pid}
                  parentId={item.id}
                />
              ) : null}
            </div>
          </div>
        );
      })}
      <ProjectChildAutocomplete
        placeholder="Child #2"
        projectId={pid}
        parentId={parentId}
      />
    </div>
  );
}
