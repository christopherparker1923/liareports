import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

import { api } from "../utils/api";
import { Button } from "@mantine/core";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center  bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="mt-12 rounded-md border-4 border-black bg-orange-600 p-10 text-center">
        <Image
          src="/lia_logo.png"
          width="240"
          height="240"
          alt="Lineside Industrial Automation logo"
        />
        <h1>LIAReports</h1>
        <Button className="bg-white hover:bg-orange-200">Enter</Button>
      </div>
    </main>
  );
};

export default Home;
