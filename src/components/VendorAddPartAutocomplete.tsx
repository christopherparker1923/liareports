import { Autocomplete, Button } from "@mantine/core";
import { VendorPart } from "@prisma/client";
import { useMemo, useState } from "react";
import { z } from "zod";
import { api } from "../utils/api";

export const vendorPartSchema = z.object({
  manufacturerPartNumber: z.string({ required_error: "Required" }),
  vendorId: z.string({ required_error: "Required" }),
});

function findPartIdByPartNumber(
  partNumber: string,
  allManuParts: {
    id: string;
    partNumber: string;
    description: string | null;
    manufacturerName: string;
  }[]
): string | null {
  const matchingPart = allManuParts.find(
    (part) => part.partNumber === partNumber
  );
  return matchingPart ? matchingPart.id : null;
}

export function VendorAddPartAutoComplete(vendor: {
  id: string;
  name: string;
  vendorParts: VendorPart[];
}) {
  const [addPart, setAddPart] = useState("");
  const [addPartId, setAddPartId] = useState("");
  const { data: allManuParts } = api.parts.getAllParts.useQuery();

  const availableParts = useMemo(
    () =>
      allManuParts
        ?.filter(
          (part) =>
            vendor.vendorParts.findIndex(
              (vendorPart) =>
                vendorPart.manufacturerPartNumber === part.partNumber
            ) === -1
        )
        .map((part, index) => ({
          value: part.partNumber,
          group: part.manufacturerName,
          id: part.id,
          index,
        })) || [],
    [vendor, allManuParts]
  );

  const { mutate: addVendorPart } = api.vendorParts.addVendorPart.useMutation({
    onError: () => {
      console.log("error");
    },
    onSuccess: async () => {
      console.log("success");
      setAddPart("");
    },
  });

  if (!allManuParts) return <div>Loading</div>;

  console.log(addPart);
  console.log(addPartId);

  return (
    <div className="mt-2 flex w-2/5 flex-row">
      <Autocomplete
        //itemComponent={({ value, id }) => <div>{value}</div>}
        className="w-2/5"
        id={addPartId}
        value={addPart}
        onChange={setAddPart}
        maxDropdownHeight={300}
        limit={50}
        placeholder="Add part to Vendor"
        data={availableParts}
      />
      {addPart && (
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
          onClick={() => {
            setAddPartId(findPartIdByPartNumber(addPart, allManuParts) ?? "");
            console.log(addPart);
            console.log(addPartId);
            addVendorPart({
              vendorId: vendor.id,
              manufacturerPartNumber: addPartId,
            });
          }}
        >
          Submit
        </Button>
      )}
    </div>
  );
}
