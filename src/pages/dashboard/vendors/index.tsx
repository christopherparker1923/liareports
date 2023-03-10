// pages/index.tsx

import { Accordion, Dialog, Flex, Modal, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { GetServerSideProps } from "next";
import Link from "next/link";
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
      await allManufacturers.refetch();
      close();
      // void queryClient.parts.getAllPartsFull.refetch();
    },
  });

  const deleteManufacturer = api.manufacturers.deleteManufacturer.useMutation({
    onSuccess: async () => {
      await allManufacturers.refetch();
    },
  });

  const form = useForm({
    validate: zodResolver(manufacturerSchema),
    initialValues: {
      name: "",
    },
  });

  console.log(allManufacturers);
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
      <Dialog position={{ left: "50%", top: "25%" }} opened={openedDialog}>
        <Text>
          Confirm manufacturer deletion?
          <Flex>
            <AppButton
              label="Delete"
              onClick={() => {
                setOpenedDialog(false);
                deleteManufacturer.mutate(manufacturerForDelete);
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
        {allManufacturers.data?.map((manufacturer) => {
          return (
            <Accordion.Item
              value={manufacturer.name.toString()}
              key={manufacturer.name}
            >
              <Accordion.Control>{manufacturer.name}</Accordion.Control>
              <Accordion.Panel>
                {manufacturer.manufacturerParts?.map((part) => {
                  return (
                    <div key={part.id} className="flex items-center gap-2">
                      <Text className="w-1/5">{part.partNumber ?? ""}</Text>
                      <Text className="w-auto">{part.description ?? ""}</Text>
                    </div>
                  );
                })}
                <AppButton
                  label="Delete"
                  hidden={manufacturer.manufacturerParts.length != 0}
                  onClick={() => {
                    setOpenedDialog(true);
                    setManufacturerForDelete(manufacturer.name);
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

Manufacturers.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Manufacturers;
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
