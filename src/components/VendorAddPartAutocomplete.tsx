import { Autocomplete } from "@mantine/core";
import type { VendorPart } from "@prisma/client";
import { useMemo, useState } from "react";
import { z } from "zod";
import { api } from "../utils/api";

export const vendorPartSchema = z.object({
  manufacturerPartId: z.string({ required_error: "Required" }),
  vendorName: z.string({ required_error: "Required" }),
});

export function VendorAddPartAutoComplete(vendor: {
  id: string;
  name: string;
  vendorParts: VendorPart[];
}) {
  const [selectedPart, setSelectedPart] = useState<string>("");
  const { data: allManuParts } = api.parts.getAllParts.useQuery();

  console.log("vendor", vendor);
  console.log("vendor parts", vendor.vendorParts);
  console.log("manu parts", allManuParts);

  const availableParts = useMemo(
    () =>
      allManuParts
        ?.filter(
          (part) =>
            vendor.vendorParts.findIndex(
              (vendorPart) => vendorPart.manufacturerPartNumber === part.id
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
  const context = api.useContext();
  const { mutate: addVendorPart } = api.vendorParts.addVendorPart.useMutation({
    onSuccess: async () => {
      await context.vendors.invalidate();
      setSelectedPart("");
    },
  });

  function handleAddPartToVendor(part: {
    value: string;
    group: string;
    id: string;
    index: number;
  }) {
    addVendorPart({
      vendorName: vendor.name,
      manufacturerPartId: part.id,
    });
  }

  if (!allManuParts) return <div>Loading</div>;

  return (
    <div className="mt-2 flex w-2/5 flex-row">
      <Autocomplete
        //itemComponent={({ value, id }) => <div>{value}</div>}
        className="w-2/5"
        onChange={setSelectedPart}
        onItemSubmit={handleAddPartToVendor}
        value={selectedPart}
        maxDropdownHeight={300}
        limit={50}
        placeholder="Add part to Vendor"
        data={availableParts}
      />
      {/* {addPart && (
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
            // console.log(addPart);
            // console.log(addPartId);
            // addVendorPart({
            //   vendorId: vendor.id,
            //   manufacturerPartNumber: addPartId,
            // });
          }}
        >
          Submit
        </Button>
      )} */}
    </div>
  );
}
