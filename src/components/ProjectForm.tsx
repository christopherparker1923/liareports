import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { NumberInput, TextInput, Box, Group, Textarea } from "@mantine/core";
import { AppButton } from "./AppButton";
import { api } from "../utils/api";
import { useQueryClient } from "@tanstack/react-query";

export const projectSchema = z.object({
  projectNumber: z
    .string()
    .length(5, { message: "Project Number should be 5 digits" })
    .or(
      z
        .string()
        .length(6, { message: "Quote Number should be Q followed by 5 digits" })
        .startsWith("Q")
    ),
  name: z.string({ required_error: "Required" }),
  description: z.string({ required_error: "Required" }),
  revision: z.string({ required_error: "Required" }),
  status: z.string({ required_error: "Required" }),
  projectLead: z.string({ required_error: "Required" }),
});

export function ProjectForm({
  setOpened,
}: {
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm({
    validate: zodResolver(projectSchema),
    initialValues: {
      projectNumber: "",
      name: "",
      description: "",
      revision: "R0",
      status: "",
      projectLead: "",
    },
  });

  const queryClient = api.useContext();
  const { mutate: createProject, data } =
    api.projects.createProject.useMutation({
      onSuccess: () => {
        setOpened(false);
        queryClient.projects.getAllProjects.refetch();
      },
    });

  console.log(data);

  return (
    <Box sx={{ maxWidth: 340 }} mx="auto">
      <form onSubmit={form.onSubmit((values) => createProject(values))}>
        <TextInput
          withAsterisk
          label="Project Number"
          placeholder="##### or Q#####"
          {...form.getInputProps("projectNumber")}
        />
        <TextInput
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
          label="Status"
          placeholder=""
          mt="sm"
          {...form.getInputProps("status")}
        />
        <TextInput
          label="Project Lead"
          placeholder=""
          mt="sm"
          {...form.getInputProps("projectLead")}
        />
        <Group position="right" mt="xl">
          <AppButton label="Submit" type="submit" />
        </Group>
      </form>
    </Box>
  );
}
