import type { GetServerSideProps } from "next";
import type { ReactElement } from "react";
import { useState } from "react";
import { Layout } from "../../../../components/Layout";
import { getBasicServerSideProps } from "../../../../services/getBasicSeverSideProps";
import type { NextPageWithLayout } from "../../../_app";
import { Button, FileInput, Text, Notification } from "@mantine/core";
import { AppButton } from "../../../../components/AppButton";
import ImportPartsUtil from "../../../../utils/importParts";
import { IconX } from "@tabler/icons-react";
import { api } from "../../../../utils/api";

const ImportParts: NextPageWithLayout = () => {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [
    chooseValidFileNotificationVisiblity,
    setChooseValidFileNotificationVisibility,
  ] = useState(false);

  // TODO: Use this mutuate inplace inplace of the prisma.upsert in importParts.ts, you can pass this around as an argument to a function!
  const { mutate: importPartsMutate } = api.parts.importParts.useMutation();
  return (
    <>
      <FileInput
        placeholder="Pick file"
        label="Select Parts File"
        description=".csv"
        className="mb-2 w-96"
        value={importFile}
        onChange={setImportFile}
      />
      <AppButton
        label={"Run Import"}
        onClick={() => {
          if (!importFile) {
            setChooseValidFileNotificationVisibility(true);
            console.log(
              "Returning without calling ImportPartsUtil: ",
              importFile
            );
            return;
          }
          console.log("Calling Import PartsUtil");
          //ImportPartsUtil(mutate, importFile);
          ImportPartsUtil(importFile);
        }}
      ></AppButton>
      {chooseValidFileNotificationVisiblity && (
        <Notification
          className="mt-11 w-2/5"
          onClose={() => setChooseValidFileNotificationVisibility(false)}
          icon={<IconX size="1.1rem" />}
          color="red"
        >
          Select a CSV file to continue
        </Notification>
      )}
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

export type mutateType = { typeof(importPartsMutate) };
