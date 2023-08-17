import { Modal, TextInput, Text } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { api } from "../../utils/api";
import { AppButton } from "../AppButton";
import { manufacturerSchema, newRevisionSchema } from "../ZodSchemas";
import { StringOrTemplateHeader } from "@tanstack/react-table";

export function AddNewRevisionModal({
  id,
  projectNumber,
  name,
  description,
  revision,
  status,
  projectLead,
}: {
  id: number;
  projectNumber: string;
  name: string;
  description: string;
  revision: string;
  status: string | null;
  projectLead: string | null;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    validate: zodResolver(newRevisionSchema),
    initialValues: {
      revision: revision,
      status: status,
      description: description,
      projectLead: projectLead,
    },
  });

  // const { mutate: createManufacturer } =
  //   api.manufacturers.createManufacturer.useMutation({
  //     onError: () => {
  //       console.log("error");
  //     },
  //     onSuccess: () => {
  //       console.log("success");
  //       close();
  //       // void queryClient.parts.getAllPartsFull.refetch();
  //     },
  //   });

  const handleNewRevision = () => {
    console.log("Handle new revision");

    // Make new revision history project with existing values

    // Iterate over all project children and project parts

    // Make new childs and parts connected to new revision history project

    // Update the original project with new rev form values and new createdBy from ctx
  };

  return (
    <>
      <AppButton label="New Revision - WIP" onClick={open} />
      <Modal opened={opened} onClose={close} title="New Revision" centered>
        <form onSubmit={form.onSubmit((values) => handleNewRevision())}>
          <Text>{name}</Text>
          <TextInput
            withAsterisk
            label="Revision"
            mt="sm"
            {...form.getInputProps("revision")}
          />
          <TextInput
            withAsterisk
            label="Status"
            mt="sm"
            {...form.getInputProps("status")}
          />
          <TextInput
            withAsterisk
            label="Description"
            mt="sm"
            {...form.getInputProps("description")}
          />
          <TextInput
            withAsterisk
            label="Project Lead"
            mt="sm"
            {...form.getInputProps("projectLead")}
          />
          <div className="mt-2 flex items-center justify-around">
            {/* TODO uncomment and finish implementing New Revision Functionality */}

            {/* <AppButton label={"Submit"} type="submit" />
            <AppButton label={"Clear"} onClick={() => form.reset()}></AppButton> */}
          </div>
        </form>
      </Modal>
    </>
  );
}
