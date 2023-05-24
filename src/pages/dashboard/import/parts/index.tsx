import { GetServerSideProps } from "next";
import { ReactElement, useState } from "react";
import { Layout } from "../../../../components/Layout";
import { getBasicServerSideProps } from "../../../../services/getBasicSeverSideProps";
import { NextPageWithLayout } from "../../../_app";
import { Button, FileInput, Text } from "@mantine/core";
import { AppButton } from "../../../../components/AppButton";
import ImportPartsUtil from "../../../../utils/importParts";

const ImportParts: NextPageWithLayout = () => {
  const [file, setFile] = useState<File | null>(null);
  console.log(file);
  return (
    <>
      <FileInput
        placeholder="Pick file"
        label="Select Parts File"
        description=".csv"
        className="mb-2 w-96"
        value={file}
        onChange={setFile}
      />
      <AppButton
        label={"Run Import"}
        onClick={ImportPartsUtil(file)}
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
