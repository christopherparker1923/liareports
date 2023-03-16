// pages/index.tsx

import { Modal, NumberInput, Text, TextInput } from "@mantine/core";
import type { GetServerSideProps } from "next";
import { ReactElement, useEffect, useRef, useState } from "react";
import { Layout } from "../../../components/Layout";
import { getBasicServerSideProps } from "../../../services/getBasicSeverSideProps";
import type { NextPageWithLayout } from "../../_app";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import { AppButton } from "../../../components/AppButton";
import { useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { IconCurrencyCent, IconCurrencyDollar } from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";

export const vendorPartPriceLeadHistorySchema = z.object({
  startDate: z.date({ required_error: "Required" }),
  price: z.number({ required_error: "Required" }).min(0),
  leadTime: z.number({ required_error: "Required" }).min(0),
  vendorPartId: z.string({ required_error: "Required" }),
});

const PartDetailView: NextPageWithLayout = () => {
  const router = useRouter();
  const dollarRef = useRef<HTMLInputElement>(null);
  const { pnum } = router.query as { pnum: string };
  const [priceDollar, setPriceDollar] = useState<number>(0);
  const [priceCent, setPriceCent] = useState<number>(0);

  //   const allVendors = api.vendors.getAllVendors.useQuery();
  //const [vendorForDelete, setVendorForDelete] = useState("");
  const [openedDialog, setOpenedDialog] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    validate: zodResolver(vendorPartPriceLeadHistorySchema),
    initialValues: {
      startDate: new Date(),
      price: 0,
      leadTime: 0,
      vendorPartId: pnum,
    },
  });

  const vendorPartHistory =
    api.vendorPartPriceLeadHistory.getVendorPartHistory.useQuery(pnum, {
      onSuccess: () => {
        form.setValues({
          price: vendorPartHistory.data?.[0]?.price ?? 0,
          leadTime: vendorPartHistory.data?.[0]?.leadTime ?? 0,
        });
        if (dollarRef.current)
          dollarRef.current.value = vendorPartHistory.data?.[0]?.price;
      },
    });

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

  console.log(form.values);

  if (!vendorPartHistory) return <div>Loading...</div>;
  if (!pnum) return <div>Invalid part id</div>;
  return (
    <>
      <div className="flex justify-between">
        <div className="flex">
          <Text className="mr-4" size="sm">
            Placehodler <br />
            for Image
          </Text>
          <Text size="xl">{pnum}</Text>
        </div>
        <AppButton label="Add Part History" onClick={open} />
        <Modal
          opened={opened}
          onClose={close}
          title="Add Part History"
          centered
        >
          <form
            onSubmit={form.onSubmit((values) => {
              console.log("submitted");
              return createVendorPartPriceLeadHistory({
                ...values,
                price: parseFloat(dollarRef.current?.value ?? "") ?? 0,
                
              });
            })}
          >
            <DatePickerInput
              withAsterisk
              placeholder="Pick date"
              label="Date"
              mt="sm"
              mx="auto"
              maw={400}
              dropdownType="modal"
              {...form.getInputProps("startDate")}
            />
            <div className="flex justify-between gap-2">
              <NumberInput
                className="w-2/5"
                withAsterisk
                label="Price (CAD)"
                mt="sm"
                step={0.01}
                precision={2}
                ref={dollarRef}
                hideControls={true}
                icon={<IconCurrencyDollar size="1rem" />}
              />

              <NumberInput
                className="w-2/5"
                withAsterisk
                label="Lead Time (days)"
                mt="sm"
                hideControls={true}
                min={0}
                {...form.getInputProps("leadTime")}
              />
            </div>
            <div className="mt-2 flex items-center justify-around">
              <AppButton label={"Submit"} type="submit" />
              <AppButton
                label={"Clear"}
                onClick={() => form.reset()}
              ></AppButton>
            </div>
          </form>
        </Modal>
      </div>
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
