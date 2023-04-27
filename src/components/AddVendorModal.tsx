import { Modal, TextInput, Text, NumberInput } from "@mantine/core";
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
      province: "Ontario",
      country: "Canada",
    },
  });

  const { mutate: createVendor } = api.vendors.createVendor.useMutation({
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      console.log("success");
      close();
    },
  });

  return (
    <>
      <AppButton label="New Vendor" onClick={open} />
      <Modal opened={opened} onClose={close} title="Add New Vendor" centered>
        <form
          onSubmit={form.onSubmit((values) =>
            createVendor({
              //fields go here
              addressNo: 0,
              city: "",
              country: "",
              emailContact: "",
              name: values.name,
              phoneContact: "",
              postalCode: "",
              province: "",
              streetName: "",
            })
          )}
        >
          <TextInput
            withAsterisk
            label="Vendor Name"
            mt="sm"
            {...form.getInputProps("name")}
          />
          <TextInput
            withAsterisk
            label="Primary Phone Contact"
            mt="sm"
            placeholder="(519) 111-1111"
            {...form.getInputProps("phoneContact")}
          />
          <TextInput
            label="Fax Contact"
            mt="sm"
            placeholder="(519) 111-1111"
            {...form.getInputProps("faxContact")}
          />
          <TextInput
            withAsterisk
            label="Email Contact"
            mt="sm"
            placeholder="name@adress.com"
            {...form.getInputProps("emailContact")}
          />
          <Text className="mt-6">Address</Text>
          <div className="flex gap-1">
            <NumberInput
              withAsterisk
              label="Street Number"
              mt="sm"
              {...form.getInputProps("addressNo")}
              hideControls
            />
            <TextInput
              withAsterisk
              label="Street Name"
              mt="sm"
              placeholder="Ottawa St"
              {...form.getInputProps("streetName")}
            />
          </div>
          <div className="flex gap-1">
            <TextInput
              withAsterisk
              label="City"
              mt="sm"
              {...form.getInputProps("city")}
            />
            <TextInput
              withAsterisk
              label="Postal Code"
              mt="sm"
              placeholder="A1A 1A1"
              {...form.getInputProps("postalCode")}
            />
          </div>
          <div className="flex gap-1">
            <TextInput
              withAsterisk
              label="Province"
              mt="sm"
              {...form.getInputProps("province")}
            />
            <TextInput
              withAsterisk
              label="Country"
              mt="sm"
              {...form.getInputProps("country")}
            />
          </div>
          <div className="mt-2 flex items-center justify-around">
            <AppButton label={"Submit"} type="submit" />
            <AppButton label={"Clear"} onClick={() => form.reset()}></AppButton>
          </div>
        </form>
      </Modal>
    </>
  );
}
