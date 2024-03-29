import { Autocomplete, Button, TextInput } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { ChildTypes } from "@prisma/client";
import type { ProjectChild } from "@prisma/client";
import { useState } from "react";
import { api } from "../../utils/api";

const childrenType = Object.values(ChildTypes);

export default function ProjectChildAutocomplete({
  part,
  placeholder,
  parentId,
  projectId,
}: {
  part?: ProjectChild;
  placeholder?: string;
  parentId: string | undefined | null;
  projectId: string;
  style?: React.CSSProperties;
}) {
  const [value, setValue] = useState<ChildTypes | string>(
    part?.childType || ""
  );
  const [name, setName] = useState<string | undefined>(part?.name);

  const utils = api.useContext();
  const deleteProjectChild = api.projectChilds.deleteProjectChild.useMutation({
    onSettled: async () => {
      await utils.projects.getProjectChildrenByProjectNumber.invalidate(
        projectId
      );
    },
  });

  const { mutate: upsertChild } = api.projects.upsertChild.useMutation({
    onMutate: async (newChild) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await utils.projects.getProjectChildrenByProjectNumber.cancel();

      // Snapshot the previous value
      const previousChildren =
        utils.projects.getProjectChildrenByProjectNumber.getData(projectId);

      if (!previousChildren) return;

      // Optimistically update to the new value
      utils.projects.getProjectChildrenByProjectNumber.setData(
        projectId,
        () => {
          return {
            rootParts: previousChildren.rootParts,
            tree: [
              ...previousChildren.tree,
              {
                childType: newChild.childType as ChildTypes,
                id: randomId(),
                parentId: parentId ?? null,
                name: newChild.childType,
                projectParts: [],
                projectNumber: projectId,
                revision: "y", //make default values
                status: "y", //make default values
              },
            ],
          };
        }
      );
      // Return a context object with the snapshotted value
      setValue("");
      return { previousChildren };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      utils.projects.getProjectChildrenByProjectNumber.setData(
        projectId,
        context?.previousChildren
      );
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await utils.projects.getProjectChildrenByProjectNumber.invalidate(
        projectId
      );
    },
  });
  function handleChildChange({
    value,
    newName,
  }: {
    value: string;
    newName?: string;
  }) {
    upsertChild({
      childType: value,
      projectNumber: projectId,
      id: part?.id,
      parentId: parentId,
      name: newName || name,
    });
  }
  return (
    <div className="mb-4 flex w-2/5">
      {part && (
        <div className="flex items-center">
          <TextInput
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Child Name"
            onBlur={(e) =>
              handleChildChange({
                newName: e.target.value,
                value: part.childType,
              })
            }
          />
        </div>
      )}
      <Autocomplete
        className={`${!part && parentId ? "pl-8" : ""}  w-full`}
        value={value}
        onChange={(value) => setValue(value)}
        data={childrenType.map((type) => ({ value: type }))}
        maxDropdownHeight={300}
        placeholder={placeholder || "Child Type"}
        onItemSubmit={handleChildChange}
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
            onClick={() => deleteProjectChild.mutate(part.id)}
          >
            Remove
          </Button>
        </>
      )}
    </div>
  );
}
