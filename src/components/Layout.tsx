import { AppShell } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { HeaderResponsive } from "./Header";
import { MyNavbar } from "./MyNavbar";

export function Layout({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    router.events.on("routeChangeStart", () => setLoading(true));
    router.events.on("routeChangeComplete", () => setLoading(false));
    router.events.on("routeChangeError", () => setLoading(false));
    return () => {
      router.events.off("routeChangeStart", () => setLoading(true));
      router.events.off("routeChangeComplete", () => setLoading(false));
      router.events.off("routeChangeError", () => setLoading(false));
    };
  }, [router.events]);
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
        navbar={<MyNavbar opened={opened} setLoading={setLoading} />}
        // aside={
        //   <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
        //     <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
        //       <Text>Application sidebar</Text>
        //     </Aside>
        //   </MediaQuery>
        // }
        // footer={
        //   <Footer height={60} p="md">
        //     Application footer
        //   </Footer>
        // }
        header={<HeaderResponsive opened={opened} setOpen={setOpened} />}
      >
        {loading ? (
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          children
        )}
      </AppShell>
    </>
  );
}
