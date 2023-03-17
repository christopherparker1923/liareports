import { Modal, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { api } from "../utils/api";
import { AppButton } from "./AppButton";
import { vendorSchema } from "./ZodSchemas";

export function AddVendorModal() {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    validate: zodResolver(vendorSchema),
    initialValues: {
      name: "",
    },
  });

  const { mutate: createVendor } = api.vendors.createVendor.useMutation({
    onError: () => {
      console.log("error");
    },
    onSuccess: async () => {
      console.log("success");
      close();
    },
  });

  return (
    <>
      <AppButton label="New Vendor" onClick={open} />
      <Modal opened={opened} onClose={close} title="Add New Vendor" centered>
        <form onSubmit={form.onSubmit((values) => createVendor(values))}>
          <TextInput
            withAsterisk
            label="Vendor Name"
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
