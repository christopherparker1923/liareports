import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { NumberInput, TextInput, Box, Group, Textarea } from "@mantine/core";
import { AppButton } from "./AppButton";

const schema = z.object({
  projectNumber: z
    .string()
    .length(5, { message: "Project Number should be 5 digits" })
    .or(
      z
        .string()
        .length(6, { message: "Quote Number should be Q followed by 5 digits" })
        .startsWith("Q")
    ),
  // name: z.string({ required_error: "Required" }),
  // age: z
  //   .number()
  //   .min(18, { message: "You must be at least 18 to create an account" }),
});

//console.log(schema.parse({ projectNumber: "12" }));

export function ProjectForm() {
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      projectNumber: "",
      name: "",
      description: "",
      revision: "R0",
      status: "",
    },
  });

  return (
    <Box sx={{ maxWidth: 340 }} mx="auto">
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput
          withAsterisk
          label="Project Number"
          placeholder="##### or Q#####"
          {...form.getInputProps("projectNumber")}
        />
        {/* <TextInput
          withAsterisk
          label="Project Name"
          placeholder="22130 - BOM"
          mt="sm"
          {...form.getInputProps("name")}
        />
        <Textarea
          withAsterisk
          label="Project Description"
          placeholder=""
          mt="sm"
          {...form.getInputProps("description")}
        />
        <TextInput
          withAsterisk
          label="Revision"
          placeholder="R0"
          mt="sm"
          {...form.getInputProps("revision")}
        />
        <TextInput
          withAsterisk
          label="Status"
          placeholder="22130 - BOM"
          mt="sm"
          {...form.getInputProps("status")}
        /> */}
        <Group position="right" mt="xl">
          <AppButton label="Submit" />
        </Group>
      </form>
    </Box>
  );
}
