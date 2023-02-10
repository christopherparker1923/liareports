/* eslint-disable @typescript-eslint/unbound-method */
import { Button, Text, useMantineColorScheme } from "@mantine/core";

import type { GetServerSideProps } from "next";
import type { ReactElement } from "react";
import { Layout } from "../../components/Layout";
import { getBasicServerSideProps } from "../../services/getBasicSeverSideProps";
import { api } from "../../utils/api";

const Dashboard = () => {
  const { toggleColorScheme } = useMantineColorScheme();
  const { data } = api.example.getAll.useQuery();

  return (
    <>
      <Text>Resize app to see responsive navbar in action</Text>
      <Button
        className="tw-bg-blue-500 dark:bg-green-500"
        onClick={() => toggleColorScheme()}
      >
        Toggle Mode
      </Button>
    </>
  );
};

export default Dashboard;
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
Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
