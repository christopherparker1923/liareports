/* eslint-disable @typescript-eslint/unbound-method */
import { Button, Text, useMantineColorScheme } from "@mantine/core";

import type { GetServerSideProps } from "next";
import type { ReactElement } from "react";
import { Layout } from "../../components/Layout";
import { getBasicServerSideProps } from "../../services/getBasicSeverSideProps";

const Dashboard = () => {
  const { toggleColorScheme } = useMantineColorScheme();

  return (
    <>
      <Text>Welcome to LIAReports!</Text>
    </>
  );
};

export default Dashboard;
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
