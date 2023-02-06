import { type NextPage } from "next";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  Group,
  SimpleGrid,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import { theme } from "../../tailwind.config.cjs";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const theme = useMantineTheme();

  if (sessionData) {
    router.push("/dashboard");
  }

  // I added justify-center to the main, so that the grid would be centered, getting rid of margin on both sides, just a little cleaner and doesn't require any extra divs
  return (
    <main className="min-w-screen flex min-h-screen items-center justify-center bg-gradient-to-b from-blackSqueeze to-neptune">
      {/* I moved the styling we had on the div, just onto the SimpleGrid itself, try and do as few divs as possible, if you have to add a div (wrapper) its perfectly fine, but try to minimize it where we can */}
      <SimpleGrid
        cols={1}
        verticalSpacing="xl"
        className="container w-2/3 max-w-lg justify-center rounded-md border-2 border-black p-10 text-center"
      >
        <Card
          style={{ backgroundColor: "white" }}
          bg={theme.colorScheme === "dark" ? "dark" : "gray"}
          shadow="sm"
          p="lg"
          radius="md"
          withBorder
        >
          <Card.Section>
            <Image
              src="/lia_logo.png"
              width={320} // This is the same as '320', just a little more explicit, using actual number instead of a string
              height={240} // same as above
              alt="Lineside Industrial Automation logo"
              className="m-auto h-[200px] w-[320px]"
            />
          </Card.Section>

          <Title className="m-4">LIAReports</Title>
          <Auth />
        </Card>

        <Image
          src="/lia_logo.png"
          width={320} // This is the same as '320', just a little more explicit, using actual number instead of a string
          height={240} // same as above
          alt="Lineside Industrial Automation logo"
          className="m-auto h-[200px] w-[320px]"
        />

        <Link href="/dashboard">
          {/* With this now the button takes the full width of the parent, minus the padding, if you want a smaller button you can just change the width directly (w-full to something else) or remove it completely*/}
        </Link>
      </SimpleGrid>
    </main>
  );
};

const Auth: React.FC = () => {
  const { data: sessionData } = useSession();

  console.log(sessionData);

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={
          sessionData ? () => void signOut() : () => void signIn("azure-ad")
        }
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </div>
  );
};

export default Home;
