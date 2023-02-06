import {
  AppShell,
  Aside,
  Burger,
  Button,
  Footer,
  Header,
  Image,
  MediaQuery,
  Navbar,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { ButtonGroup } from "@mantine/core/lib/Button/ButtonGroup/ButtonGroup";
import { useFullscreen } from "@mantine/hooks";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { theme } from "../../../tailwind.config.cjs";

const Dashboard = () => {
  // This is a hook that allows us to navigate to other pages, we can use this instead of <Link> if we want
  const router = useRouter();
  //This gets called on our button Click, we use void to tell typescript that we don't care about the return value
  const handleHomeClick = () => {
    void router.push("/");
  };

  const [opened, setOpened] = useState(false);

  const theme = useMantineTheme();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="Dashboard" content="Dashboard for browsing projects" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppShell
        styles={{
          main: {
            background:
              theme.colorScheme === "dark"
                ? theme.colors.gray[8]
                : theme.colors.gray[0],
          },
        }}
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
        aside={
          <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
              <Text>Application sidebar</Text>
            </Aside>
          </MediaQuery>
        }
        footer={
          <Footer height={60} p="md">
            Application footer
          </Footer>
        }
        header={
          <Header height={{ base: 50, md: 70 }} p="md">
            <div
              style={{ display: "flex", alignItems: "center", height: "100%" }}
            >
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>

              <Header className="d-flex flex-wrap" height={80} p="xs">
                <Image
                  src="/logo_noname.png"
                  width={64} // This is the same as '320', just a little more explicit, using actual number instead of a string
                  height={64} // same as above
                  alt="Lineside Industrial Automation logo"
                  className="d-flex align-items-center m-auto flex h-[64px] w-[64px]"
                />
                <Button.Group className="d-flex align-items-center m-auto flex">
                  <Button color="teal">Dashboard</Button>
                  <Button>Inventory</Button>
                  <Button>Sign Out</Button>
                </Button.Group>
              </Header>
            </div>
          </Header>
        }
      >
        <Text>Resize app to see responsive navbar in action</Text>
      </AppShell>
    </>
  );
};

export default Dashboard;
