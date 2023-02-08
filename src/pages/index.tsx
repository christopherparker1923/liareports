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
        <Card
          className="min-w-fit bg-gray-100 dark:bg-gray-600"
          shadow="sm"
          p="lg"
          radius="md"
          withBorder
        >
          <Card.Section className="m-1">
            <Image
              src="/lia_logo.png"
              width={320}
              height={240}
              alt="Lineside Industrial Automation logo"
              className="m-auto h-[200px] w-[320px]"
            />
          </Card.Section>
          <Card.Section>
            <Title className="m-4">LIAReports</Title>
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
