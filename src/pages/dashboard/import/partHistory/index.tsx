/* eslint-disable @typescript-eslint/unbound-method */
import { Button, Text, useMantineColorScheme } from "@mantine/core";

import type { GetServerSideProps } from "next";
import type { ReactElement } from "react";
import Dashboard from "../..";
import { getBasicServerSideProps } from "../../../../services/getBasicSeverSideProps";
import { Layout } from "../../../../components/Layout";

const Import = () => {
  return <Text>import part history</Text>;
};

export default Import;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const basicProps = await getBasicServerSideProps(context);
  if (!basicProps.session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
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
Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
