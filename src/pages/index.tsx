import { type NextPage } from "next";
import Link from "next/link";
import { Button, SimpleGrid, Title } from "@mantine/core";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";

const Home: NextPage = () => {
  return (
    // I added justify-center to the main, so that the grid would be centered, getting rid of margin on both sides, just a little cleaner and doesn't require any extra divs
    <main className="min-w-screen flex min-h-screen items-center justify-center bg-gradient-to-b from-blackSqueeze to-neptune">
      {/* I moved the styling we had on the div, just onto the SimpleGrid itself, try and do as few divs as possible, if you have to add a div (wrapper) its perfectly fine, but try to minimize it where we can */}
      <SimpleGrid
        cols={1}
        verticalSpacing="xl"
        className="container w-2/3 max-w-lg justify-center rounded-md border-2 border-black bg-gray-100 p-10 text-center"
      >
        {/* This wasn't really youre fault, there's some magic that requrires that width and height prop, but its based on the actual image, to actually change the size we can just add a className */}
        {/* I also got rid of some extra divs, I know you were using style=... but you can do that all with classNames, ill link a cheat sheet for a conversion from normal css */}
        <Image
          src="/lia_logo.png"
          width={320} // This is the same as '320', just a little more explicit, using actual number instead of a string
          height={240} // same as above
          alt="Lineside Industrial Automation logo"
          className="m-auto h-[200px] w-[320px]"
        />
        <Title className="m-4">LIAReports</Title>
        {/* think of this Link component as an <a> tag, you can wrap it around something for going to a new page, The page is /src/inventory/index.tsx */}
        <Link href="/dashboard">
          {/* With this now the button takes the full width of the parent, minus the padding, if you want a smaller button you can just change the width directly (w-full to something else) or remove it completely*/}
          <Button className="w-full bg-rhino text-white hover:bg-gray-600">
            Enter
          </Button>
          <AuthShowcase />
        </Link>
      </SimpleGrid>
    </main>
  );
};

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

export default Home;
