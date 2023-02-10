// pages/index.tsx

import { Button } from "@mantine/core";
import type { GetServerSideProps } from "next";
import type { ReactElement } from "react";
import { Layout } from "../../../../components/Layout";
import { getBasicServerSideProps } from "../../../../services/getBasicSeverSideProps";
import type { NextPageWithLayout } from "../../../_app";

const PackingSlip: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Generate Packing Slip</h1>
      <Button variant="outline">Generate</Button>
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
