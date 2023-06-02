import { Autocomplete, Button } from "@mantine/core";
import type { ProjectPart } from "@prisma/client";
import { useState } from "react";
import { api } from "../../utils/api";
import PartQuantities from "./PartQuantities";
import PartPriceLead from "./PartPriceLead";

export default function ProjectPartAutocomplete({
  part,
  placeholder,
  parentId,
  style,
  projectId,
}: {
  part?: ProjectPart & {
    manufacturerPart: {
      partNumber: string;
    };
  };
  placeholder?: string;
  parentId?: string | undefined | null;
  style?: React.CSSProperties;
  projectId: string;
}) {
  const [value, setValue] = useState(part?.manufacturerPart.partNumber || "");

  const { data } = api.parts.getAllParts.useQuery();
  const utils = api.useContext();
  const { mutate: upsertPart } = api.projects.addPartToProject.useMutation({
    onSettled: async () => {
      setValue("");
      await utils.projects.getProjectChildrenByProjectNumber.invalidate(
        projectId
      );
    },
  });

  const deleteProjectPart = api.projectParts.deleteProjectPart.useMutation({
    onSettled: async () => {
      await utils.projects.getProjectChildrenByProjectNumber.invalidate(
        projectId
      );
    },
  });

  function handlePartChange({
    description,
    value,
    id,
  }: {
    description: string;
    value: string;
    id: string;
  }) {
    upsertPart({
      partId: id,
      projectId,
      parentId: parentId ?? undefined,
    });
  }
  return (
    <div className="my-1 flex w-full justify-between gap-x-1">
      <div className={`${parentId ? "pl-8" : ""} flex w-1/5 flex-row`}>
        <Autocomplete
          className="w-full"
          maxDropdownHeight={300}
          value={value}
          onChange={(value) => setValue(value)}
          placeholder={placeholder || "Part number"}
          limit={50}
          style={style}
          onItemSubmit={handlePartChange}
          data={
            data?.map((part) => ({
              value: part.partNumber || "No Description",
              id: part.id,
              description: part.description,
            })) || []
          }
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
              onClick={() => deleteProjectPart.mutate(part.id)}
            >
              Remove
            </Button>
          </>
        )}
      </div>
      <PartPriceLead part={part} />
      <PartQuantities part={part} projectNumber={projectId} />
    </div>
  );
}
