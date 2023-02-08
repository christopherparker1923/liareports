import {
  Group,
  Navbar,
  ThemeIcon,
  UnstyledButton,
  Text,
  Avatar,
  Box,
  useMantineTheme,
} from "@mantine/core";
import {
  IconAlignBoxBottomCenter,
  IconChevronLeft,
  IconChevronRight,
  IconFileArrowRight,
} from "@tabler/icons-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { string } from "zod";

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
}

export function MyNavbar({ opened }: { opened: boolean }) {
  const { data: sessionData } = useSession();
  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
    >
      <Navbar.Section>
        <MainLink
          color="blue"
          icon={<IconAlignBoxBottomCenter />}
          label="Projects"
        />
        <MainLink color="teal" icon={<IconFileArrowRight />} label="Generate" />
        <MainLink
          color="violet"
          icon={<IconAlignBoxBottomCenter />}
          label="Parts"
        />
      </Navbar.Section>
      <Navbar.Section>
        {sessionData && <User session={sessionData} />}
      </Navbar.Section>
    </Navbar>
  );
}

function MainLink({ icon, color, label }: MainLinkProps) {
  return (
    <UnstyledButton
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
              {session.user.name}
            </Text>
            <Text color="dimmed" size="xs">
              {session.user.email}
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
