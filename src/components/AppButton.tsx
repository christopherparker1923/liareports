import { Group, ThemeIcon, UnstyledButton, Text } from "@mantine/core";

interface AppButtonProps {
  label: string;
  onClick?: () => void;
}

export function AppButton({ label, onClick }: AppButtonProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      sx={(theme) => ({
        display: "block",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[2],
        },
      })}
    >
      <Text size="sm">{label}</Text>
    </UnstyledButton>
  );
}
