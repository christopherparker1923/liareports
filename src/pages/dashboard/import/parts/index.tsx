import { GetServerSideProps } from "next";
import { ReactElement, useState } from "react";
import { Layout } from "../../../../components/Layout";
import { getBasicServerSideProps } from "../../../../services/getBasicSeverSideProps";
import { NextPageWithLayout } from "../../../_app";
import { Button, FileInput, Text } from "@mantine/core";

const ImportParts: NextPageWithLayout = () => {
  const [file, setFile] = useState<File | null>(null);
  console.log(file);
  return (
    <>
      <FileInput
        placeholder="Pick file"
        label="Select Parts File"
        description=".csv"
        className="w-96"
        value={file}
        onChange={setFile}
      />
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
