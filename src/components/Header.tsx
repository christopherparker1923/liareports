import {
  Header,
  Group,
  Burger,
  MediaQuery,
  useMantineTheme,
  Button,
} from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Logo } from "./Logo";

type HeaderProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const HeaderResponsive = ({ open, setOpen }: HeaderProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const { data: sessionData, status } = useSession();

  if (!sessionData) {
    router.push("/");
  }

  return (
    <Header height={{ base: 50, md: 70 }}>
      <Group sx={{ height: "100%" }} px={20} position="apart">
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <>
            <Burger
              opened={open}
              onClick={() => setOpen((o: boolean) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
            <Logo width={32} height={32} />
          </>
        </MediaQuery>
        <MediaQuery smallerThan="md" styles={{ display: "none" }}>
          <Logo width={48} height={48} />
        </MediaQuery>
        <Button.Group className="d-flex align-items-center m-auto flex">
          <Button color="teal">Dashboard</Button>
          <Button>Inventory</Button>
          <Button onClick={() => void signOut()}>Sign Out</Button>
        </Button.Group>
      </Group>
    </Header>
  );
};
