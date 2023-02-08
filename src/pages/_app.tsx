import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "../utils/api";
import "../styles/globals.css";
import type { ColorScheme } from "@mantine/core";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import Script from "next/script";
import { toggleTheme } from "../utils/toggleColorScheme";
import { useState } from "react";

const MyApp: AppType<{ session: Session | null; theme: ColorScheme }> = ({
  Component,
  pageProps: { theme: initialTheme, session, ...pageProps },
}) => {
  const [theme, setTheme] = useState<ColorScheme>(initialTheme);
  const toggleColorScheme = () => {
    const newTheme = toggleTheme();
    setTheme(newTheme);
  };
  return (
    <>
      <SessionProvider session={session}>
        <ColorSchemeProvider
          toggleColorScheme={toggleColorScheme}
          colorScheme={theme}
        >
          <MantineProvider theme={{ colorScheme: theme }}>
            <Component {...pageProps} />
          </MantineProvider>
        </ColorSchemeProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
