import {
  Group,
  ThemeIcon,
  UnstyledButton,
  Text,
  UnstyledButtonProps,
} from "@mantine/core";

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  onClick?: () => void;
}

export function AppButton({
  type,
  label,
  onClick,
}: AppButtonProps & UnstyledButtonProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      type={type}
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
