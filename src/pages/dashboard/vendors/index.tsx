// pages/index.tsx

import { Accordion, Dialog, Flex, Modal, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { GetServerSideProps } from "next";
import { ReactElement, useState } from "react";
import { AppButton } from "../../../components/AppButton";
import { Layout } from "../../../components/Layout";
import { getBasicServerSideProps } from "../../../services/getBasicSeverSideProps";
import { api } from "../../../utils/api";
import type { NextPageWithLayout } from "../../_app";
import { useForm, zodResolver } from "@mantine/form";
import { VendorAddPartAutoComplete } from "../../../components/VendorAddPartAutocomplete";
import { vendorSchema } from "../../../components/ZodSchemas";
import { AddVendorModal } from "../../../components/AddVendorModal";

const Vendors: NextPageWithLayout = () => {
  const allVendors = api.vendors.getAllVendors.useQuery();
  const [vendorForDelete, setVendorForDelete] = useState("");

  const [openedDialog, setOpenedDialog] = useState(false);

  const deleteVendor = api.vendors.deleteVendor.useMutation({
    onSuccess: async () => {
      await allVendors.refetch();
    },
  });
  return (
    <>
      <AddVendorModal />
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
                        {part.ManufacturerPart.partNumber ?? ""}
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
