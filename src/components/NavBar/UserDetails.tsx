import {
  Group,
  Text,
  Avatar,
  Box,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import type { Session } from "next-auth";

export function UserDetails({ session }: { session: Session }) {
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
          <Avatar src={session?.user?.image} radius="xl" />
          <Box
            sx={{
              flex: 1,
            }}
          >
            <Text size="sm" weight={500}>
              {matches
                ? shortenString(session?.user?.name, 27)
                : shortenString(session?.user?.name, 10)}
            </Text>
            <Text color="dimmed" size="xs">
              {matches
                ? shortenString(session?.user?.email, 30)
                : shortenString(session?.user?.email, 12)}
            </Text>
            <Text size="sm" weight={500}>
              {session?.user?.role}
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
