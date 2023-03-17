import { Autocomplete, Button } from "@mantine/core";
import { VendorPart } from "@prisma/client";
import { useMemo, useState } from "react";
import { api } from "../utils/api";

export function VendorAddPartAutoComplete(vendor: {
  id: string;
  name: string;
  vendorParts: VendorPart[];
}) {
  const [addPart, setaddPart] = useState("");
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
      setaddPart("");
      //await allManufacturers.refetch();
      // void queryClient.parts.getAllPartsFull.refetch();
    },
  });

  if (!allManuParts) return <div>Loading</div>;

  return (
    <div className="mt-2 flex w-2/5 flex-row">
      <Autocomplete
        className="w-2/5"
        value={addPart}
        onChange={setaddPart}
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
          onClick={() =>
            addVendorPart({
              vendorId: vendor.id,
              manufacturerPartNumber: addPart,
            })
          }
        >
          Submit
        </Button>
      )}
    </div>
  );
}
