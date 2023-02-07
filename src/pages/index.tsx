import { type NextPage } from "next";
import Link from "next/link";
import {
  Card,
  SimpleGrid,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { useRouter } from "next/router";
import { DarkModeToggle } from "../components/DarkModeToggle";
import { LoginButton } from "../components/LoginButton";

const Home: NextPage = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const theme = useMantineTheme();

  if (status === "loading") {
    return <div>loading...</div>;
  }

  if (sessionData) {
    router.push("/dashboard");
  }

  // I added justify-center to the main, so that the grid would be centered, getting rid of margin on both sides, just a little cleaner and doesn't require any extra divs
  return (
    <main className="min-w-screen flex min-h-screen items-center justify-center bg-gradient-to-b from-blackSqueeze to-neptune dark:from-blackSqueeze dark:to-rhino">
      <SimpleGrid
        cols={1}
        className="container max-w-lg justify-center rounded-md border-2 border-black p-10 text-center"
      >
        <Card
          className="min-w-fit bg-gray-100 dark:bg-gray-600"
          bg={theme.colorScheme === "dark" ? "theme.colors.neptune" : "white"}
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

export default Home;
