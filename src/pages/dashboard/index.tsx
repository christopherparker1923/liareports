/* eslint-disable @typescript-eslint/unbound-method */
import {
  AppShell,
  Button,
  Footer,
  Navbar,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useState } from "react";
import { HeaderResponsive } from "../../components/Header";
import { getBasicServerSideProps } from "../../services/getBasicSeverSideProps";

const Dashboard = () => {
  const { toggleColorScheme } = useMantineColorScheme();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="Dashboard" content="Dashboard for browsing projects" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppShell
        className="textit bg-white dark:bg-black"
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={
          <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={{ sm: 200, lg: 300 }}
          >
            <Text>Application navbar</Text>
          </Navbar>
        }
        // aside={
        //   <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
        //     <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
        //       <Text>Application sidebar</Text>
        //     </Aside>
        //   </MediaQuery>
        // }
        footer={
          <Footer height={60} p="md">
            Application footer
          </Footer>
        }
        header={<HeaderResponsive open={opened} setOpen={setOpened} />}
      >
        <Text>Resize app to see responsive navbar in action</Text>
        <Button
          className="tw-bg-blue-500 dark:bg-green-500"
          onClick={() => toggleColorScheme()}
        >
          Toggle Mode
        </Button>
      </AppShell>
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
