import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

export default class _Document extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Script src="/theme.js" strategy="beforeInteractive" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
