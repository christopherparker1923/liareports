// pages/index.tsx

import type { GetServerSideProps } from "next";
import type { ReactElement } from "react";
import { AppButton } from "../../../components/AppButton";
import { Layout } from "../../../components/Layout";
import { PartsTable } from "../../../components/PartsTable";
import { getBasicServerSideProps } from "../../../services/getBasicSeverSideProps";
import type { NextPageWithLayout } from "../../_app";

const Manufacturers: NextPageWithLayout = () => {
  return (
    <>
      <AppButton label="Placeholder for Detail View" />
    </>
  );
};

Manufacturers.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Manufacturers;
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
