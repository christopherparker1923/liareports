import {
  Autocomplete,
  AutocompleteItem,
  Button,
  TextInput,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { ChildTypes, ProjectChild } from "@prisma/client";
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
  const [name, setName] = useState<string | undefined>(
    part?.name || part?.childType
  );

  const { mutate: upsertChild } = api.projects.upsertChild.useMutation();
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
    <div className="flex w-2/5">
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
        className={`${!part && parentId ? "pl-8" : ""} w-full`}
        value={value}
        onChange={(value) => setValue(value)}
        data={childrenType.map((type) => ({ value: type }))}
        maxDropdownHeight={300}
        placeholder={placeholder || "Child Type"}
        onItemSubmit={handleChildChange}
      />
    </div>
  );
}
