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
import { ReactElement, useCallback, useMemo, useState } from "react";
import { AppButton } from "../../../components/AppButton";
import { Layout } from "../../../components/Layout";
import { getBasicServerSideProps } from "../../../services/getBasicSeverSideProps";
import { api } from "../../../utils/api";
import type { NextPageWithLayout } from "../../_app";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { PackingSlipPart } from "../generate/packing-slip";
import { VendorAddPartAutoComplete } from "../../../components/VendorAddPartAutocomplete";

export const vendorSchema = z.object({
  name: z.string({ required_error: "Required" }),
});

export const vendorPartSchema = z.object({
  manufacturerPartNumber: z.string({ required_error: "Required" }),
  vendorId: z.string({ required_error: "Required" }),
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
          // function addVendorPart(
          //   id: any
          // ): import("react").MouseEventHandler<HTMLButtonElement> | undefined {
          //   throw new Error("Function not implemented.");
          // }

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
                <VendorAddPartAutoComplete {...vendor} />
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
