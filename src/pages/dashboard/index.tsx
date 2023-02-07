/* eslint-disable @typescript-eslint/unbound-method */
import {
  AppShell,
  Aside,
  Burger,
  Button,
  Footer,
  Group,
  Header,
  MediaQuery,
  Navbar,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import { HeaderResponsive } from "../../components/Header";

const Dashboard = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  // This is a hook that allows us to navigate to other pages, we can use this instead of <Link> if we want
  const router = useRouter();
  //This gets called on our button Click, we use void to tell typescript that we don't care about the return value
  const handleHomeClick = () => {
    void router.push("/");
  };

  const [opened, setOpened] = useState(false);

  const theme = useMantineTheme();

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="Dashboard" content="Dashboard for browsing projects" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppShell
        className={`children ${
          theme.colorScheme === "dark"
            ? theme.colors.gray[8]
            : theme.colors.gray[0]
        }`}
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
        <Button onClick={() => toggleColorScheme(colorScheme)}>
          Toggle Mode
        </Button>
      </AppShell>
    </>
  );
};

export default Dashboard;
