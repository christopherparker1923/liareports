import { type NextPage } from "next";
import Link from "next/link";
import { Card, SimpleGrid, Title } from "@mantine/core";
import Image from "next/image";
import { DarkModeToggle } from "../components/DarkModeToggle";
import { LoginButton } from "../components/LoginButton";
import type { GetServerSideProps } from "next";
import { getBasicServerSideProps } from "../services/getBasicSeverSideProps";

const Home: NextPage = () => {
  return (
    <main className="min-w-screen flex min-h-screen items-center justify-center bg-gradient-to-b from-blackSqueeze to-neptune dark:from-blackSqueeze dark:to-rhino">
      <SimpleGrid
        cols={1}
        className="container max-w-lg justify-center rounded-md p-10 text-center"
      >
        <Card className="min-w-fit rounded-md bg-gray-100 p-5 shadow-md dark:bg-gray-600">
          <Card.Section className="m-1">
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
            <Title className="m-4 text-3xl text-black dark:text-gray-300">
              LIAReports
            </Title>
          </Card.Section>
          <Card.Section>
            <LoginButton />
          </Card.Section>
          <Card.Section>
            <DarkModeToggle />
          </Card.Section>
        </Card>
        <Link href="/dashboard"></Link>
      </SimpleGrid>
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
