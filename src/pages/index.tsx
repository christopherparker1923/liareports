import { type NextPage } from "next";
import Link from "next/link";
import { Card, SimpleGrid, Title } from "@mantine/core";
import Image from "next/image";
import { DarkModeToggle } from "../components/DarkModeToggle";
import { LoginButton } from "../components/LoginButton";
import type { GetServerSideProps } from "next";
import { getBasicServerSideProps } from "../services/getBasicSeverSideProps";
import { useContext } from "react";

const Home: NextPage = () => {
  // const  theme = useCon[]text(Theme)
  return (
    <main className="min-w-screen flex min-h-screen items-center justify-center bg-gradient-to-b from-blackSqueeze to-neptune dark:from-blackSqueeze dark:to-rhino">
      <Card className="m-0 flex min-w-fit flex-col items-center justify-center rounded-md bg-gray-100 p-5 shadow-md dark:bg-gray-600">
        <Card.Section>
          <Image
            src="/lia_logo.png"
            width={362}
            height={208}
            loading="eager"
            alt="Lineside Industrial Automation logo"
            className="m-auto "
          />
        </Card.Section>
        <Card.Section>
          <h1 className="m-4 text-3xl font-bold text-black dark:text-gray-300">
            LIAReports
          </h1>
        </Card.Section>
        <Card.Section>
          <LoginButton />
        </Card.Section>
        <Card.Section className="float-left w-full">
          <DarkModeToggle />
        </Card.Section>
      </Card>
      <Link href="/dashboard"></Link>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const basicProps = await getBasicServerSideProps(context);
  if (basicProps.session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
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

export default Home;
