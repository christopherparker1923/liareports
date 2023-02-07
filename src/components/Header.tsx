import {
  Header,
  Group,
  Burger,
  MediaQuery,
  useMantineTheme,
  Button,
  Flex,
} from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { DarkModeToggle } from "./DarkModeToggle";
import { Logo } from "./Logo";

type HeaderProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const HeaderResponsive = ({ open, setOpen }: HeaderProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const { status } = useSession();

  if (status === "loading") {
    return <div>loading...</div>;
  }

  if (status === "unauthenticated") {
    void router.push("/");
  }

  return (
    <Header
      height={{ base: 120, xxs: 70 }}
      className="flex min-h-fit flex-wrap"
    >
      <Group
        className="flex min-w-full flex-wrap justify-center xs:justify-between"
        sx={{ height: "100%" }}
        px={20}
        position="apart"
      >
        <div>
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={open}
              onClick={() => setOpen((o: boolean) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>
          <Logo width={48} height={48} />
        </div>
        <Flex>
          <Button.Group className="align-items-center flex">
            <Button color="teal">Dashboard</Button>
            <Button>Inventory</Button>
            <Button onClick={() => void signOut()}>Sign Out</Button>
          </Button.Group>
          <DarkModeToggle />
        </Flex>
      </Group>
    </Header>
  );
};
