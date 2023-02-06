import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

import { api } from "../utils/api";
import { Button, SimpleGrid, Title } from "@mantine/core";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <main
      className="min-w-screen flex min-h-screen items-center
     bg-gradient-to-b from-blackSqueeze to-neptune"
    >
      <div
        className="container mx-auto w-2/3 max-w-lg
      justify-center rounded-md border-2 border-black bg-gray-100 p-10 text-center"
      >
        <SimpleGrid cols={1} verticalSpacing="xl">
          <div style={{ width: 240, marginLeft: "auto", marginRight: "auto" }}>
            <Image
              src="/lia_logo.png"
              width="480"
              height="480"
              alt="Lineside Industrial Automation logo"
            />
          </div>
          <div>
            <Title className="m-4">LIAReports</Title>
          </div>
          <div>
            <Button className="bg-rhino text-white hover:bg-gray-600">
              Enter
            </Button>
          </div>
        </SimpleGrid>
      </div>
    </main>
  );
};

export default Home;
