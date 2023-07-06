import {
  Header,
  Burger,
  MediaQuery,
  useMantineTheme,
  Tooltip,
} from "@mantine/core";
import { signOut } from "next-auth/react";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { DarkModeToggle } from "./DarkModeToggle";
import { Logo } from "./Logo";
import Clock from "./Clock";

type HeaderProps = {
  opened: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const HeaderResponsive = ({ opened, setOpen }: HeaderProps) => {
  const theme = useMantineTheme();

  return (
    <Header
      height={{ base: 120, xs: 70 }}
      className="flex flex-wrap items-center justify-center px-4 xs:justify-between xs:whitespace-nowrap"
    >
      <div className="flex w-full items-center justify-between xs:w-fit">
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            className="float-left"
            opened={opened}
            onClick={() => setOpen((o: boolean) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
        <Tooltip
          label="Home"
          position="right"
          sx={(theme) => ({
            color:
              theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[2],
          })}
        >
          <Link href="/dashboard" className="pointer">
            <Logo width={48} height={48} />
          </Link>
        </Tooltip>
        <Clock className="ml-2 text-black dark:text-gray-300" />
      </div>
      <div className="flex w-full justify-evenly xs:w-fit">
        {/* <NavButton>Dashboard</NavButton>
        <NavButton>Inventory</NavButton> */}
        <NavButton onClick={() => void signOut()}>Sign Out</NavButton>
        <DarkModeToggle />
      </div>
    </Header>
  );
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

function NavButton({ children, ...props }: Props) {
  return (
    <button
      className="mx-2 whitespace-nowrap rounded-md bg-none px-2 py-2 hover:bg-gray-400 dark:hover:bg-gray-700"
      onClick={props.onClick}
    >
      {children}
    </button>
  );
}
