import { Autocomplete, Button, Flex, Group, Text } from "@mantine/core";
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
  sortBy,
}: {
  part?: ProjectPart & {
    manufacturerPart: {
      partNumber: string;
      manufacturerName: string;
      description?: string | null;
    };
  };
  placeholder?: string;
  parentId?: string | undefined | null;
  style?: React.CSSProperties;
  projectId: string;
  sortBy: String;
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
      <Flex
        gap="sm"
        justify="flex-start"
        align="center"
        direction="row"
        wrap="wrap"
        className={`${parentId ? "pl-4" : ""} mb-4 w-full justify-between`}
      >
        <Group noWrap spacing={0}>
          <Autocomplete
            className="w-fit min-w-fit"
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
                X
              </Button>
              <Text className="mx-2">{part.manufacturerPart.description}</Text>
            </>
          )}
        </Group>
        <PartPriceLead part={part} sortBy={sortBy} projectNumber={projectId} />
        <PartQuantities part={part} projectNumber={projectId} />
      </Flex>
    </div>
  );
}
