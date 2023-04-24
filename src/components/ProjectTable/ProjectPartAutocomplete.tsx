import { Autocomplete, Button, NumberInput } from "@mantine/core";
import type { ProjectPart, ManufacturerPart } from "@prisma/client";
import { useState } from "react";
import { api } from "../../utils/api";
import PartQuantities from "./PartQuantities";

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
  return (
    <div className="my-1 flex w-full justify-between gap-x-1">
      <div className={`${parentId ? "pl-8" : ""} flex w-2/5 flex-row`}>
        <Autocomplete
          className="w-full"
          maxDropdownHeight={300}
          value={value}
          onChange={(value) => setValue(value)}
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
        {/* {part?.id && ( */}
        {/*   <> */}
        {/*     <Button */}
        {/*       sx={(theme) => ({ */}
        {/*         color: */}
        {/*           theme.colorScheme === "dark" */}
        {/*             ? theme.colors.dark[0] */}
        {/*             : theme.black, */}

        {/*         "&:hover": { */}
        {/*           backgroundColor: */}
        {/*             theme.colorScheme === "dark" */}
        {/*               ? theme.colors.dark[8] */}
        {/*               : theme.colors.gray[2], */}
        {/*         }, */}
        {/*       })} */}
        {/*       className="border border-gray-500" */}
        {/*       onClick={() => deleteProjectPart(part.id)} */}
        {/*     > */}
        {/*       Remove */}
        {/*     </Button> */}
        {/*   </> */}
        {/* )} */}
      </div>
      {/* <PartQuantities part={part} projectNumber={projectId} /> */}
    </div>
  );
}
