// pages/index.tsx

import { Accordion, Dialog, Flex, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { ReactElement, useState } from "react";
import { AppButton } from "../../../components/AppButton";
import { Layout } from "../../../components/Layout";
import { getBasicServerSideProps } from "../../../services/getBasicSeverSideProps";
import { api } from "../../../utils/api";
import type { NextPageWithLayout } from "../../_app";

const Manufacturers: NextPageWithLayout = () => {
  const allManufacturers =
    api.manufacturers.getAllManufacturerNamesParts.useQuery();
  const [manufacturerForDelete, setManufacturerForDelete] = useState("");
  const [openedDialog, setOpenedDialog] = useState(false);

  const deleteManufacturer = api.manufacturers.deleteManufacturer.useMutation({
    onSuccess: async () => {
      await allManufacturers.refetch();
    },
  });

  console.log(allManufacturers);
  return (
    <>
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
                      <Link
                        className="w-1/5"
                        href={`parts/${manufacturer.name}/${part.partNumber}`}
                      >
                        <Text>{part.partNumber ?? ""}</Text>
                      </Link>

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
