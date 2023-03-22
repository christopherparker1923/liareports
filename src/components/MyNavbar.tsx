import {
  Group,
  Navbar,
  ThemeIcon,
  UnstyledButton,
  Text,
  Avatar,
  Box,
  useMantineTheme,
  Accordion,
  rem,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconAlignBoxBottomCenter,
  IconBuildingFactory2,
  IconBuildingStore,
  IconChevronLeft,
  IconChevronRight,
  IconFileArrowRight,
  IconFileDollar,
  IconFileDots,
  IconFileSettings,
  IconTriangleSquareCircle,
} from "@tabler/icons-react";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  onClick?: () => void;
}
type NavBarProps = {
  opened: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
export function MyNavbar({ opened }: NavBarProps) {
  const { data: sessionData } = useSession();
  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
    >
      <Navbar.Section>
        <Link href="/dashboard/projects">
          <MainLink
            color="blue"
            icon={<IconAlignBoxBottomCenter />}
            label="Projects"
          />
        </Link>
        <Link href="/dashboard/parts">
          <MainLink
            color="violet"
            icon={<IconTriangleSquareCircle />}
            label="Parts"
          />
        </Link>
        <Link href="/dashboard/manufacturers">
          <MainLink
            color="teal"
            icon={<IconBuildingFactory2 />}
            label="Manufacturers"
          />
        </Link>
        <Link href="/dashboard/vendors">
          <MainLink
            color="orange"
            icon={<IconBuildingStore />}
            label="Vendors"
          />
        </Link>
        <Accordion
          styles={() => ({
            content: {
              padding: 0,
            },
          })}
        >
          <Accordion.Item value="packingSlip">
            <Accordion.Control style={{ padding: "10px" }}>
              <Group>
                <ThemeIcon color="red" variant="light">
                  <IconFileSettings />
                </ThemeIcon>
                <Text size="sm">Generate</Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel className="ml-4">
              <Link href="/dashboard/generate/packing-slip">
                <MainLink
                  color="red"
                  icon={<IconFileArrowRight />}
                  label="Packing Slip"
                />
              </Link>
            </Accordion.Panel>
            <Accordion.Panel className="ml-4">
              <Link href="/dashboard/generate/purchase-order" className="p-0">
                <MainLink
                  color="red"
                  icon={<IconFileDollar />}
                  label="Purchase Order"
                />
              </Link>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Navbar.Section>
      <Navbar.Section>
        {sessionData && <User session={sessionData} />}
      </Navbar.Section>
    </Navbar>
  );
}

function MainLink({ icon, color, label, onClick }: MainLinkProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

export function User({ session }: { session: Session }) {
  const theme = useMantineTheme();
  const matches = useMediaQuery("(min-width: 1200px)");

  function shortenString(str: string | null | undefined, maxLength: number) {
    if (!str) return "";
    if (str.length <= maxLength) return str;
    const halfway = Math.floor(maxLength / 2);
    return str.slice(0, halfway) + "..." + str.slice(str.length - halfway);
  }

  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}
    >
      <UnstyledButton
        sx={{
          display: "block",
          width: "100%",
          padding: "0px",
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        }}
      >
        <Group
          sx={{
            overflow: "hidden",
            "&:hover": { overflow: "visible" },
          }}
        >
          <Avatar src={session.user.image} radius="xl" />
          <Box
            sx={{
              flex: 1,
            }}
          >
            <Text size="sm" weight={500}>
              {matches
                ? shortenString(session.user.name, 27)
                : shortenString(session.user.name, 10)}
            </Text>
            <Text color="dimmed" size="xs">
              {matches
                ? shortenString(session.user.email, 30)
                : shortenString(session.user.email, 12)}
            </Text>
          </Box>

          {theme.dir === "ltr" ? (
            <IconChevronRight size={18} />
          ) : (
            <IconChevronLeft size={18} />
          )}
        </Group>
      </UnstyledButton>
    </Box>
  );
}
