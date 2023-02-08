import { createGetInitialProps, createStylesServer } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

const getInitialProps = createGetInitialProps();
export default class _Document extends Document {
  static getInitialProps = getInitialProps;

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
