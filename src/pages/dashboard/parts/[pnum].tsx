// pages/index.tsx

import { Modal, Text, TextInput } from "@mantine/core";
import type { GetServerSideProps } from "next";
import { ReactElement, useState } from "react";
import { Layout } from "../../../components/Layout";
import { getBasicServerSideProps } from "../../../services/getBasicSeverSideProps";
import type { NextPageWithLayout } from "../../_app";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import { JacobTestTable } from "../../../components/JacobTestTable";
import { AppButton } from "../../../components/AppButton";
import { useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { vendorSchema } from "../vendors";
import { vendorPartPriceLeadHistorySchema } from "../../../server/api/routers/vendorPartPriceLeadHistory";
import { date } from "zod";

const PartDetailView: NextPageWithLayout = () => {
  const router = useRouter();
  const { pnum } = router.query as { pnum: string };

  //   const allVendors = api.vendors.getAllVendors.useQuery();
  //const [vendorForDelete, setVendorForDelete] = useState("");
  const [openedDialog, setOpenedDialog] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const vendorPartHistory =
    api.vendorPartPriceLeadHistory.getVendorPartHistory.useQuery(pnum);

  const { mutate: createVendorPartPriceLeadHistory } =
    api.vendorPartPriceLeadHistory.createVendorPartPriceLeadHistory.useMutation(
      {
        onError: () => {
          console.log("error");
        },
        onSuccess: async () => {
          console.log("success");
          await vendorPartHistory.refetch();
          close();
        },
      }
    );

  if (vendorPartHistory.isLoading || vendorPartHistory.isError) {
    return <div>Loading</div>;
  }

  const form = useForm({
    validate: zodResolver(vendorPartPriceLeadHistorySchema),
    initialValues: {
      startDate: new Date(),
      price:
        vendorPartHistory?.data[vendorPartHistory?.data?.length - 1]?.price ??
        0,
      leadTime:
        vendorPartHistory?.data[vendorPartHistory?.data?.length - 1]
          ?.leadTime ?? 0,
    },
  });

  //   const part = api.projects.getProjectById.useQuery(pid, {
  //     enabled: !!pid,
  //  });
  //if (!part) return <div>Loading...</div>;
  if (!pnum) return <div>Invalid part id</div>;
  return (
    <>
      <Text size="lg">{pnum}</Text>
      <AppButton label="New Vendor" onClick={open} />
      <Modal opened={opened} onClose={close} title="Add New Vendor" centered>
        <form
        // onSubmit={form.onSubmit((values) =>
        //   createVendorPartPriceLeadHistory(values)
        // )}
        >
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
};

PartDetailView.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default PartDetailView;
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
