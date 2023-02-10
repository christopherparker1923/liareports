// pages/index.tsx

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  NumberInput,
  TextInput,
} from "@mantine/core";
import type { GetServerSideProps } from "next";
import { handleClientScriptLoad } from "next/script";
import { ReadableStreamDefaultController } from "node:stream/web";
import { describe } from "node:test";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { Layout } from "../../../../components/Layout";
import { getBasicServerSideProps } from "../../../../services/getBasicSeverSideProps";
import { api } from "../../../../utils/api";
import { generatePackingSlip } from "../../../../utils/generatePackingSlip";
import type { NextPageWithLayout } from "../../../_app";

const PackingSlip: NextPageWithLayout = () => {
  const [selectedParts, setSelectedParts] = useState<string[]>([""]);
  const [selectedPartDescriptions, setSelectedPartDescriptions] = useState<
    string[]
  >([""]);
  const [qtyArray, setQtyArray] = useState<number[]>([1]);
  const { data, isError, isLoading } = api.parts.getAllParts.useQuery();

  const autoMap: AutocompleteItem[] | undefined = data?.map((part) => {
    return {
      value: part.partNumber,
      group: part.manufacturerName,
    };
  });

  //const memoAutoCompletes = useMemo(() => createAutoCompletes(), selectedParts);

  const availableParts = useMemo(() => {
    return data
      ?.filter((part) => !selectedParts.includes(part.partNumber))
      .map((part) => {
        return {
          value: part.partNumber,
          group: part.manufacturerName,
          description: part.description,
        };
      });
  }, [selectedParts, data]);

  useEffect(() => {
    createAutoCompletes();
  }, [selectedParts]);

  function createAutoCompletes() {
    function handlePartsChange(value: string, index: number) {
      const newSelectedParts = selectedParts;
      const newSelectedPartDescriptions = selectedPartDescriptions;
      const deleteQtyArrayIndex = qtyArray;
      if (!data) return;
      if (value === "") {
        newSelectedParts.splice(index, 1);
        newSelectedPartDescriptions.splice(index, 1);
        setSelectedPartDescriptions(newSelectedPartDescriptions);
        deleteQtyArrayIndex.splice(index, 1);
        setQtyArray(deleteQtyArrayIndex);
        //remove qtyArray value
      } else {
        newSelectedParts[index] = value;
        newSelectedPartDescriptions[index] =
          data[
            data?.findIndex((element) => {
              return element.partNumber === value;
            })
          ]?.description || "";
      }
      setSelectedParts([...newSelectedParts]);
      if (selectedParts.length > qtyArray.length) {
        qtyArray[qtyArray.length] = 1;
      }
    }
    function handleQtyChange(value: number, index: number) {
      const newQtyArray = qtyArray;
      newQtyArray[index] = value;
      setQtyArray([...newQtyArray]);
    }

    function handleDescriptionChange(value: string, index: number) {
      const newSelectedPartDescriptions = selectedPartDescriptions;
      newSelectedPartDescriptions[index] = value;
      setSelectedPartDescriptions([...newSelectedPartDescriptions]);
    }

    return new Array(selectedParts[0] === "" ? 1 : selectedParts.length + 1)
      .fill("")
      .map((_, index) => {
        return (
          <div key={index} className="my-1 flex w-full justify-between gap-x-1">
            <Autocomplete
              className="w-2/5"
              value={selectedParts[index] || ""}
              onChange={(value) => {
                handlePartsChange(value, index);
              }}
              maxDropdownHeight={"300px"}
              limit={50}
              placeholder="Part number"
              data={availableParts ?? []}
            />
            <TextInput
              className="w-2/5"
              variant="filled"
              placeholder="Description"
              onChange={(e) => handleDescriptionChange(e.target.value, index)}
              value={selectedPartDescriptions[index] || ""}
            />
            <NumberInput
              //inputContainer={(child) => <div className="w-fit">{child}</div>}
              min={0}
              className="w-20"
              defaultValue={1}
              placeholder="Qty"
              onChange={(value) => {
                handleQtyChange(value || 0, index);
              }}
              value={qtyArray[index]}
            />
          </div>
        );
      });
  }

  return (
    <div className="h-full">
      <h1>Generate Packing Slip</h1>
      <Button
        variant="outline"
        onClick={() =>
          generatePackingSlip(
            selectedParts,
            selectedPartDescriptions,
            qtyArray,
            "TMMC",
            "Same as Shipping",
            "Josh Stevens\nTMMC\nHand Delivered"
          )
        }
      >
        Generate
      </Button>
      {createAutoCompletes().map((a) => a)}
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
