// pages/index.tsx

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  NumberInput,
} from "@mantine/core";
import type { GetServerSideProps } from "next";
import { handleClientScriptLoad } from "next/script";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { Layout } from "../../../../components/Layout";
import { getBasicServerSideProps } from "../../../../services/getBasicSeverSideProps";
import { api } from "../../../../utils/api";
import type { NextPageWithLayout } from "../../../_app";

const PackingSlip: NextPageWithLayout = () => {
  const [selectedParts, setSelectedParts] = useState<string[]>([""]);
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
        };
      });
  }, [selectedParts, data]);

  console.log(availableParts);

  useEffect(() => {
    createAutoCompletes();
  }, [selectedParts]);

  function createAutoCompletes() {
    function handlePartsChange(value: string, index: number) {
      const newSelectedParts = selectedParts;
      if (value === "") newSelectedParts.splice(index, 1);
      else newSelectedParts[index] = value;
      setSelectedParts([...newSelectedParts]);
    }
    return new Array(selectedParts[0] === "" ? 1 : selectedParts.length + 1)
      .fill("")
      .map((_, index) => {
        return (
          <div className="my-1 flex w-2/3 justify-between gap-x-1">
            <Autocomplete
              className="w-3/5"
              key={index}
              value={selectedParts[index] || ""}
              onChange={(value) => {
                handlePartsChange(value, index);
              }}
              maxDropdownHeight={"300px"}
              limit={50}
              placeholder="Part number"
              data={availableParts ?? []}
            />

            <NumberInput
              //inputContainer={(child) => <div className="w-fit">{child}</div>}
              min={0}
              className="w-20"
              defaultValue={1}
              placeholder="Qty"
            />
          </div>
        );
      });
  }

  console.log(selectedParts);

  return (
    <div className="h-full">
      <h1>Generate Packing Slip</h1>
      <Button variant="outline">Generate</Button>
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
