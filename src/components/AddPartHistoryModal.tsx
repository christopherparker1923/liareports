import { Autocomplete, Modal, NumberInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconCurrencyDollar } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { api } from "../utils/api";
import { AppButton } from "./AppButton";
import { vendorPartPriceLeadHistorySchema } from "./ZodSchemas";

export function AddPartHistoryModal({
  pnum,
  pmanu,
}: {
  pnum: string;
  pmanu: string;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  // const [invalidVendorOpened, setInvalidVendorOpened] = useState(false);
  const dollarRef = useRef<HTMLInputElement>(null);
  const { data: vendors } = api.vendorParts.getVendorsWhoSellPart.useQuery({
    partNumber: pnum,
    manuName: pmanu,
  });
  const [vendorName, setVendorName] = useState("");
  //const [vendorPartHistory, setVendorPartHistory] = useState([]);

  const vendorPartId =
    api.vendorParts.getVendorIdByVendorNameAndPartNumber.useQuery(
      {
        vendorName: vendorName,
        partNumber: pnum,
        manuName: pmanu,
      },
      {
        onSuccess: () => {
          console.log(
            vendorPartId.data?.VendorPartPriceLeadHistory[0],
            "this one"
          );
          form.setValues({
            price: vendorPartId.data?.VendorPartPriceLeadHistory[0]?.price ?? 0,
            leadTime:
              vendorPartId.data?.VendorPartPriceLeadHistory[0]?.leadTime ?? 0,
            stock: vendorPartId.data?.VendorPartPriceLeadHistory[0]?.stock ?? 0,
          });
          if (dollarRef.current)
            dollarRef.current.value = (
              vendorPartId.data?.VendorPartPriceLeadHistory[0]?.price ?? 0
            ).toString();
        },
      }
    );

  const form = useForm({
    validate: zodResolver(vendorPartPriceLeadHistorySchema),
    initialValues: {
      startDate: new Date(),
      price: 0,
      leadTime: 0,
      stock: 0,
      vendorPartId: "",
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
          close();
        },
      }
    );

  async function handleNewVendorName() {
    await vendorPartId.refetch();
    // if (!vendorPartId.data) setInvalidVendorOpened(true);
    // else setInvalidVendorOpened(false);
    form.setValues({ vendorPartId: vendorPartId.data?.id });
  }

  if (vendorPartId.isLoading || vendorPartId.isError) return <div>Loading</div>;
  if (!vendors) return <div>Loading</div>;

  console.log("form", form.values);

  console.log("vendorPartId", vendorPartId);
  return (
    <>
      <AppButton label="Add Part History" onClick={open} />
      <Modal opened={opened} onClose={close} title="Add Part History" centered>
        <form
          onSubmit={form.onSubmit((values) => {
            console.log("submitted");
            return createVendorPartPriceLeadHistory({
              ...values,
              price: parseFloat(dollarRef.current?.value ?? "") ?? 0,
            });
          })}
        >
          {/* <Popover opened={invalidVendorOpened}>
            <Popover.Target> */}
          <Autocomplete
            withAsterisk
            maxDropdownHeight={300}
            limit={50}
            value={vendorName}
            onChange={setVendorName}
            onItemSubmit={handleNewVendorName}
            onBlur={handleNewVendorName}
            label="Vendor"
            placeholder="Select Vendor"
            data={vendors.map((vendor) => ({
              value: vendor.Vendor.name,
            }))}
          />
          {/* </Popover.Target>

            <Popover.Dropdown>Invalid Vendor</Popover.Dropdown>
          </Popover> */}

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
            />{" "}
            {/* <HoverCard position="right" shadow="md">
              <HoverCard.Target> */}
            <div className="flex items-center gap-2">
              <NumberInput
                className="w-2/5"
                withAsterisk
                label="Stock"
                mt="sm"
                hideControls={true}
                min={0}
                {...form.getInputProps("stock")}
              />
            </div>
            {/* </HoverCard.Target>
              <HoverCard.Dropdown>
                <Text size="md">
                  Use 999 for <br />
                  unknown or lots
                </Text>
              </HoverCard.Dropdown>
            </HoverCard> */}
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
