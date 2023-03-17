// pages/index.tsx

import {
  Accordion,
  Autocomplete,
  Button,
  Dialog,
  Flex,
  Modal,
  NumberInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { GetServerSideProps } from "next";
import { ReactElement, useState } from "react";
import { AppButton } from "../../../components/AppButton";
import { Layout } from "../../../components/Layout";
import { getBasicServerSideProps } from "../../../services/getBasicSeverSideProps";
import { api } from "../../../utils/api";
import type { NextPageWithLayout } from "../../_app";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

export const vendorSchema = z.object({
  name: z.string({ required_error: "Required" }),
});

type VendorPart = {
  partNumber: string;
  description: string | undefined | null;
  manufacturerName: string;
  quantity?: number;
  quantityShipped?: number;
};

type PartLineProps = {
  index: number;
  availableParts: VendorPart[];
  part: VendorPart;
  onPartChange: (index: number, part: VendorPart) => void;
};

function VendorAddPartAutoComplete({
  index,
  onPartChange,
  availableParts,
  part,
}: PartLineProps): JSX.Element {
  const handlePartChange =
    <T extends keyof VendorPart>(property: T) =>
    (value: VendorPart[T]) => {
      // Find the part with the same part number, if it exists
      const updatedPart = availableParts.find(
        (part) => part.partNumber === value
      ) || { ...part, [property]: value };
      // Call the onPartChange function with the updated part and the index
      onPartChange(index, updatedPart);
    };
  return (
    <div key={index} className="my-1 flex w-full justify-between gap-x-1">
      <div className="flex w-2/5 flex-row">
        <Autocomplete
          className="w-full"
          value={part.partNumber}
          maxDropdownHeight={300}
          limit={50}
          placeholder="Part number"
          onChange={handlePartChange("partNumber")}
          data={availableParts.map((part, index) => ({
            value: part.partNumber,
            group: part.manufacturerName,
            index,
          }))}
        />
        {part.partNumber && (
          <Button
            sx={(theme) => ({
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[0]
                  : theme.black,

              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[2],
              },
            })}
            className="border border-gray-500"
            onClick={() =>
              onPartChange(index, {
                partNumber: "",
                description: "",
                manufacturerName: "",
                quantity: 1,
              })
            }
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}

const Vendors: NextPageWithLayout = () => {
  const allVendors = api.vendors.getAllVendors.useQuery();
  const [vendorForDelete, setVendorForDelete] = useState("");
  const [openedDialog, setOpenedDialog] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const { mutate: createVendor } = api.vendors.createVendor.useMutation({
    onError: () => {
      console.log("error");
    },
    onSuccess: async () => {
      console.log("success");
      await allVendors.refetch();
      close();
      // void queryClient.parts.getAllPartsFull.refetch();
    },
  });

  const deleteVendor = api.vendors.deleteVendor.useMutation({
    onSuccess: async () => {
      await allVendors.refetch();
    },
  });

  const form = useForm({
    validate: zodResolver(vendorSchema),
    initialValues: {
      name: "",
    },
  });

  console.log(allVendors);
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
      <Dialog position={{ left: "50%", top: "25%" }} opened={openedDialog}>
        <Text>
          Confirm vendor deletion?
          <Flex>
            <AppButton
              label="Delete"
              onClick={() => {
                setOpenedDialog(false);
                deleteVendor.mutate(vendorForDelete);
              }}
            />
            <AppButton
              label="Cancel"
              onClick={() => {
                setOpenedDialog(false);
              }}
            />
          </Flex>
        </Text>
      </Dialog>
      <Accordion defaultValue="customization">
        {allVendors.data?.map((vendor) => {
          return (
            <Accordion.Item value={vendor.name.toString()} key={vendor.name}>
              <Accordion.Control>{vendor.name}</Accordion.Control>
              <Accordion.Panel>
                {vendor.vendorParts?.map((part) => {
                  return (
                    <div key={part.id} className="flex items-center gap-2">
                      <Text className="w-1/5">
                        {part.manufacturerPartNumber ?? ""}
                      </Text>
                      {/* <Text className="w-1/12">{part.price ?? ""}</Text>
                      <Text className="w-1/12">{part.stock ?? ""}</Text>
                      <Text className="w-1/12">{part.leadTime ?? ""}</Text> */}
                    </div>
                  );
                })}
                {/* <VendorAddPartAutoComplete
                  part={part}
                  key={index}
                  availableParts={availableParts}
                  index={index}
                  onPartChange={onPartChange}
                /> */}

                <AppButton
                  label="Delete"
                  hidden={vendor.vendorParts.length != 0}
                  onClick={() => {
                    setOpenedDialog(true);
                    setVendorForDelete(vendor.name);
                  }}
                />
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </>
  );
};

Vendors.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Vendors;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const basicProps = await getBasicServerSideProps(context);
  if (!basicProps.session) {
    return {
      // redirect: {
      //   destination: "/",
      //   permanent: false,
      // },
      props: {
        ...basicProps,
      },
    };
  }
  return {
    props: {
      ...basicProps,
    },
  };
};
