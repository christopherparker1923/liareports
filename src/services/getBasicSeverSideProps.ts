import type { ColorScheme } from "@mantine/core";
import { getCookie } from "cookies-next";
import type { GetServerSidePropsContext, PreviewData } from "next";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import type { ParsedUrlQuery } from "querystring";
import { authOptions } from "../server/auth";

type BasicServerSideProps = {
  session: Session | null;
  theme: ColorScheme;
};
export async function getBasicServerSideProps(
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
): Promise<BasicServerSideProps> {
  const session = await getServerSession(context.req, context.res, authOptions);
  return {
    session,
    theme: (getCookie("theme", context) as ColorScheme) || "light",
  };
}
