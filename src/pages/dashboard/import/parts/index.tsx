import type { GetServerSideProps } from "next";
import type { ReactElement } from "react";
import { useState } from "react";
import { Layout } from "../../../../components/Layout";
import { getBasicServerSideProps } from "../../../../services/getBasicSeverSideProps";
import type { NextPageWithLayout } from "../../../_app";
import { FileInput } from "@mantine/core";
import { AppButton } from "../../../../components/AppButton";
import { IconCheck, IconX } from "@tabler/icons-react";
import { api } from "../../../../utils/api";
import Papa from "papaparse";
import { PartTags, PartTypes } from "@prisma/client";
import { notifications } from "@mantine/notifications";

const ImportParts: NextPageWithLayout = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);

  // TODO: Use this mutuate inplace inplace of the prisma.upsert in importParts.ts, you can pass this around as an argument to a function!
  const { mutate: importParts, isLoading: importPartsIsLoading } =
    api.parts.importParts.useMutation({
      onError: (importPartsError) => {
        notifications.clean();
        notifications.show({
          title: "Error Creating Part",
          message: `${
            importPartsError?.message || "error message unavailable"
          }`,
          icon: <IconX />,
          color: "red",
          autoClose: 10000,
        });
      },
      onSuccess: (createPartData) => {
        close();
        notifications.clean();
        notifications.show({
          title: "Success",
          message: `${createPartData?.length || "0"} parts created`,
          icon: <IconCheck />,
          color: "green",
          autoClose: 4000,
        });
      },
    });
  if (importPartsIsLoading) {
    notifications.show({
      title: "Loading",
      message: "Processing part import request",
      loading: true,
      autoClose: false,
    });
  }
  const importFile = () => {
    // console.log("About to parse csvFile: ", csvFile);
    Papa.parse(csvFile as unknown as File, {
      complete: function ({ data }: { data: string[][] }) {
        const parts = data.slice(1, -1).map((row) => {
          // console.log("partTags: ", row[14]);
          const part = {
            partNumber: row[3]!,
            partType: row[4]?.trim() as PartTypes,
            length: parseInt(row[5] || ""),
            width: parseInt(row[6] || ""),
            height: parseInt(row[7] || ""),
            CSACert: Boolean(row[8]) || false,
            ULCert: Boolean(row[9]) || false,
            preference: parseInt(row[10] || "0"),
            description: row[11] || "",
            partTags:
              (row[14] != "" &&
                (row[14]
                  ?.trim()
                  .split(",")
                  .map((word) => word.trim()) as PartTags[])) ||
              ([] as PartTags[]),
            manufacturerName: row[13] || "",
          };
          return { id: row[0] as string, part };
        });
        if (!parts) return;
        // console.log(
        //   "Tags after parsin about to be mutated: ",
        //   parts[0]?.part.partTags
        // );
        importParts(parts);
      },
    });
  };
  return (
    <>
      <FileInput
        placeholder="Pick file"
        label="Select Parts File"
        description=".csv"
        className="mb-2 w-96"
        value={csvFile}
        onChange={setCsvFile}
      />
      <AppButton
        label={"Run Import"}
        onClick={() => {
          if (!csvFile) {
            notifications.show({
              title: "Invalid Input",
              message: `Select a valid CSV file`,
              icon: <IconX />,
              color: "red",
              autoClose: 4000,
            });
            //setChooseValidFileNotificationVisibility(true);
            console.log("Returning without calling ImportPartsUtil: ", csvFile);
            return;
          }
          console.log("Calling Import PartsUtil");
          //ImportPartsUtil(mutate, importFile);
          importFile();
        }}
      ></AppButton>
    </>
  );
};

ImportParts.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ImportParts;
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
