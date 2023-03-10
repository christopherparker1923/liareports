import { UnstyledButton, Text } from "@mantine/core";
import type { UnstyledButtonProps } from "@mantine/core";
import { forwardRef } from "react";

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  onClick?: () => void;
}

export const AppButton = (props: AppButtonProps & UnstyledButtonProps) => {
  return (
    <UnstyledButton
      onClick={props.onClick}
      type={props.type}
      {...props}
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
      <Text size="sm">{props.label}</Text>
    </UnstyledButton>
  );
};
