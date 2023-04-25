import { Modal, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { api } from "../utils/api";
import { AppButton } from "./AppButton";
import { manufacturerSchema } from "./ZodSchemas";

export function AddManufacturerModal() {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    validate: zodResolver(manufacturerSchema),
    initialValues: {
      name: "",
    },
  });

  const { mutate: createManufacturer } =
    api.manufacturers.createManufacturer.useMutation({
      onError: () => {
        console.log("error");
      },
      onSuccess: () => {
        console.log("success");
        close();
        // void queryClient.parts.getAllPartsFull.refetch();
      },
    });

  return (
    <>
      <AppButton label="New Manufacturer" onClick={open} />
      <Modal
        opened={opened}
        onClose={close}
        title="Add New Manufacturer"
        centered
      >
        <form onSubmit={form.onSubmit((values) => createManufacturer(values))}>
          <TextInput
            withAsterisk
            label="Manufacturer Name"
            mt="sm"
            {...form.getInputProps("name")}
          />
          <div className="mt-2 flex items-center justify-around">
            <AppButton label={"Submit"} type="submit" />
            <AppButton label={"Clear"} onClick={() => form.reset()}></AppButton>
          </div>
        </form>
      </Modal>
    </>
  );
}
