// pages/index.tsx

import { Autocomplete, Button, NumberInput, TextInput } from "@mantine/core";
import type { GetServerSideProps } from "next";
import type { ReactElement } from "react";
import { useCallback, useMemo, useState } from "react";
import { Layout } from "../../../../components/Layout";
import { AppButton } from "../../../../components/AppButton";
import { getBasicServerSideProps } from "../../../../services/getBasicSeverSideProps";
import { api } from "../../../../utils/api";
import { generatePackingSlip } from "../../../../utils/generatePackingSlip";
import type { NextPageWithLayout } from "../../../_app";

export type PackingSlipPart = {
  partNumber: string;
  description: string | undefined | null;
  manufacturerName: string;
  quantity?: number;
};

type PartLineProps = {
  index: number;
  availableParts: PackingSlipPart[];
  part: PackingSlipPart;
  onPartChange: (index: number, part: PackingSlipPart) => void;
};
function PartFormLine({
  index,
  onPartChange,
  availableParts,
  part,
}: PartLineProps): JSX.Element {
  const handlePartChange =
    <T extends keyof PackingSlipPart>(property: T) =>
    (value: PackingSlipPart[T]) => {
      // Find the part with the same part number, if it exists
      const updatedPart = availableParts.find(
        (part) => part.partNumber === value
      ) || { ...part, [property]: value };
      // Call the onPartChange function with the updated part and the index
      onPartChange(index, updatedPart);
    };
  return (
    <div key={index} className="my-1 flex w-full justify-between gap-x-1">
      <div className="flex w-2/5 flex-row">
        <Autocomplete
          className="w-full"
          value={part.partNumber}
          maxDropdownHeight={300}
          limit={50}
          placeholder="Part number"
          onChange={handlePartChange("partNumber")}
          data={availableParts.map((part, index) => ({
            value: part.partNumber,
            group: part.manufacturerName,
            index,
          }))}
        />
        {part.partNumber && (
          <Button
            className="border border-gray-500 bg-transparent hover:bg-transparent"
            onClick={() =>
              onPartChange(index, {
                partNumber: "",
                description: "",
                manufacturerName: "",
                quantity: 1,
              })
            }
          >
            Remove
          </Button>
        )}
      </div>
      {part.partNumber && (
        <>
          <TextInput
            className="w-2/5"
            variant="filled"
            placeholder="Description"
            value={part.description || ""}
            onChange={(e) => handlePartChange("description")(e.target.value)}
          />
          <NumberInput
            min={0}
            className="w-20"
            defaultValue={1}
            placeholder="Qty"
            value={part.quantity}
            onChange={handlePartChange("quantity")}
          />
        </>
      )}
    </div>
  );
}

const PackingSlip: NextPageWithLayout = () => {
  const [selectedParts, setSelectedParts] = useState<PackingSlipPart[]>([]);
  const onPartChange = useCallback(
    (index: number, part: PackingSlipPart) => {
      setSelectedParts((parts) => {
        if (index === parts.length) {
          return [...parts, part];
        } else {
          return parts
            .map((value, i) => (i === index ? part : value))
            .filter((part) => part.partNumber !== "");
        }
      });
    },
    [setSelectedParts]
  );
  const { data } = api.parts.getAllParts.useQuery();
  const availableParts = useMemo(
    () =>
      data
        ?.filter(
          (part) =>
            selectedParts.findIndex(
              (selectedPart) => selectedPart.partNumber === part.partNumber
            ) === -1
        )
        .map((part) => ({ ...part, quantity: 1 })) || [],
    [selectedParts, data]
  );

  return (
    <div className="h-full">
      {[
        ...selectedParts,
        { partNumber: "", description: "", manufacturerName: "", quantity: 1 },
      ].map((part, index) => (
        <PartFormLine
          part={part}
          key={index}
          availableParts={availableParts}
          index={index}
          onPartChange={onPartChange}
        />
      ))}
      <AppButton
        label="Generate"
        onClick={() =>
          void generatePackingSlip(
            selectedParts,
            "Josh Stevens",
            "TMMC\n1150 Fountain Street\nCambridge, ON",
            "Same as Billing",
            "12/25/2022",
            "000125829",
            "PO5910",
            "Engineering",
            "Comment",
            "PAID & \nTESTED"
          )
        }
      />
    </div>
  );
};

PackingSlip.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default PackingSlip;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const basicProps = await getBasicServerSideProps(context);
  if (!basicProps.session) {
    return {
      // redirect: {
      //   destination: "/",
      //   permanent: false,
      // },
      props: {
        ...basicProps,
      },
    };
  }
  return {
    props: {
      ...basicProps,
    },
  };
};
