import { GetServerSideProps } from "next";
import { ReactElement, useState } from "react";
import { Layout } from "../../../../components/Layout";
import { getBasicServerSideProps } from "../../../../services/getBasicSeverSideProps";
import { NextPageWithLayout } from "../../../_app";
import { Button, FileInput, Text, Notification } from "@mantine/core";
import { AppButton } from "../../../../components/AppButton";
import ImportPartsUtil from "../../../../utils/importParts";
import { IconX } from "@tabler/icons-react";

const ImportParts: NextPageWithLayout = () => {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [
    chooseValidFileNotificationVisiblity,
    setChooseValidFileNotificationVisibility,
  ] = useState(false);
  console.log(importFile);
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
