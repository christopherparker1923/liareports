import { Button } from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";

export function LoginButton() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button
        className="rounded-full bg-gray-300 px-10 font-semibold text-black no-underline transition hover:bg-gray-400 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-900"
        onClick={
          sessionData ? () => void signOut() : () => void signIn("azure-ad")
        }
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </div>
  );
}
