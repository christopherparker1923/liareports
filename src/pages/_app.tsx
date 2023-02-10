import type { AppProps } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "../utils/api";
import "../styles/globals.css";
import type { ColorScheme } from "@mantine/core";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { toggleTheme } from "../utils/toggleColorScheme";
import type { ReactElement, ReactNode } from "react";
import { useState } from "react";
import type { NextPage } from "next";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<CustomnPageProps> & {
  Component: NextPageWithLayout;
};
type CustomnPageProps = {
  theme: ColorScheme;
  session: Session;
};

const getInitialTheme = (theme: ColorScheme | undefined): ColorScheme => {
  if (theme) return theme;
  if (typeof window !== "undefined") {
    return (localStorage.getItem("theme") as ColorScheme) ?? "light";
  }
  return "light";
};

const MyApp = ({
  Component,
  pageProps: { theme: initialTheme, session, ...pageProps },
}: AppPropsWithLayout) => {
  const [theme, setTheme] = useState<ColorScheme>(initialTheme);
  const toggleColorScheme = () => {
    const newTheme = toggleTheme();
    setTheme(newTheme);
  };
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <SessionProvider session={session}>
        <ColorSchemeProvider
          toggleColorScheme={toggleColorScheme}
          colorScheme={theme || getInitialTheme(initialTheme)}
        >
          <MantineProvider
            theme={{
              colorScheme: theme || getInitialTheme(initialTheme),
            }}
            withGlobalStyles
            withNormalizeCSS
          >
            {getLayout(<Component {...pageProps} />)}
          </MantineProvider>
        </ColorSchemeProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
