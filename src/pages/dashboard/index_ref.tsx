import { Button } from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Component } from "react";
import { ComponentExample } from "../../components/ComponentExample";

const Inventory = () => {
  // This is a hook that allows us to navigate to other pages, we can use this instead of <Link> if we want
  const router = useRouter();
  //This gets called on our button Click, we use void to tell typescript that we don't care about the return value
  const handleHomeClick = () => {
    void router.push("/");
  };
  return (
    <>
      {/* adding the head isn't super important, but it changes the text on the actual tab */}
      <Head>
        <title>Inventory</title>
        <meta name="description" content="Start of Inventory!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Same main as other page, we could make this global if we want it on all pages */}
      <main
        className="min-w-screen flex min-h-screen flex-1 grow
     items-center justify-center bg-gradient-to-b from-blackSqueeze to-neptune"
      >
        {/* section is just like div, but its a semantic element, not necessary but a good habit to use the right ones */}
        <section className="flex h-[80vh] w-4/5 flex-col items-center rounded-lg bg-slate-100 p-12 text-center shadow-lg">
          {/* Normal h1 styling */}
          <h1 className="text-4xl">Example Inventory Page</h1>
          {/* This button we call a function instead to bring us Home, we could use another <Link> but I wanted to show another way to navigate */}
          <Button
            className="mt-12 w-1/6 bg-rhino hover:bg-puertoRico"
            onClick={handleHomeClick}
          >
            Go Home
          </Button>

          <ComponentExample text="This is an example" />
          <ComponentExample text="of how you can pass data to your reusable components" />
          <ComponentExample text="look inside src/components/ComponentExample" />
          {/* This is an example of a typescript error, in the component file (can right click go to definition, or F12 when moused over) Everything still technically works, but we know that something is missing, as there will be no text*/}
          <ComponentExample />
        </section>
      </main>
    </>
  );
};

export default Inventory;
