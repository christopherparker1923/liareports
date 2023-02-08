import { ColorScheme } from "@mantine/core";
import { getCookie } from "cookies-next";
import { GetServerSidePropsContext, PreviewData } from "next";
import { getServerSession, Session } from "next-auth";
import { ParsedUrlQuery } from "querystring";
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
