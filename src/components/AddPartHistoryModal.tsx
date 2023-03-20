import { Autocomplete, Modal, NumberInput, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconCurrencyDollar } from "@tabler/icons-react";
import { useRef, useState } from "react";
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
  const [vendorName, setVendorName] = useState("");

  // const [invalidVendorOpened, setInvalidVendorOpened] = useState(false);
  const { data: vendors } = api.vendorParts.getVendorsWhoSellPart.useQuery({
    partNumber: pnum,
    manuName: pmanu,
  });
  //const [vendorPartHistory, setVendorPartHistory] = useState([]);
  const form = useForm({
    validate: zodResolver(vendorPartPriceLeadHistorySchema),
    initialValues: {
      vendorName: "",
      startDate: new Date(),
      price: "",
      leadTime: 0,
      stock: 0,
      vendorPartId: "",
    },
  });

  const vendorPartId =
    api.vendorParts.getVendorIdByVendorNameAndPartNumber.useQuery(
      {
        vendorName: form.values.vendorName,
        partNumber: pnum,
        manuName: pmanu,
      },
      {
        onSuccess: (val) => {
          form.setValues({
            price: val?.VendorPartPriceLeadHistory[0]?.price.toString() ?? "",
            leadTime: val?.VendorPartPriceLeadHistory[0]?.leadTime ?? 0,
            stock: val?.VendorPartPriceLeadHistory[0]?.stock ?? 0,
          });
        },
        enabled: form.values.vendorName !== "",
        refetchOnWindowFocus: false,
      }
    );

  const { mutate: createVendorPartPriceLeadHistory } =
    api.vendorPartPriceLeadHistory.createVendorPartPriceLeadHistory.useMutation(
      {
        onMutate: () => {
          console.log("mutating");
        },
        onError: () => {
          console.log("error");
        },
        onSuccess: () => {
          void console.log("success");
          close();
        },
      }
    );

  function handleSubmit(values: {
    vendorName: string;
    startDate: Date;
    price: string;
    leadTime: number;
    stock: number;
    vendorPartId: string;
  }) {
    if (vendors?.some((vendor) => vendor.Vendor.name === values.vendorName))
      createVendorPartPriceLeadHistory({
        ...values,
        price: parseFloat(form.values.price ?? 0),
      });
  }
  async function handleNewVendorName() {
    form.setValues({ vendorPartId: vendorPartId.data?.id });
    await vendorPartId.refetch();
    // if (!vendorPartId.data) setInvalidVendorOpened(true);
    // else setInvalidVendorOpened(false);
  }

  // if (vendorPartId.isLoading || vendorPartId.isError)
  //   return <AppButton label="Add Part History" onClick={open} />;
  if (!vendors) return <div>Loading no vendors</div>;

  // console.log("form", form.values);

  // console.log("vendorPartId", vendorPartId);
  return (
    <>
      <AppButton label="Add Part History" onClick={open} />
      <Modal opened={opened} onClose={close} title="Add Part History" centered>
        {/* <form
          onSubmit={form.onSubmit(
            (values) => console.log(values)
            // createVendorPartPriceLeadHistory({
            //   ...values,
            //   price: parseFloat(form.values.price ?? 0),
            // })
          )}
        > */}
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          {/* <Popover opened={invalidVendorOpened}>
            <Popover.Target> */}
          <Autocomplete
            withAsterisk
            maxDropdownHeight={300}
            limit={50}
            value={vendorName}
            onChange={(value) => {
              setVendorName(value);
              form.setValues({ vendorName: value });
            }}
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
            <TextInput
              className="w-2/5"
              required
              label="Price"
              mt="sm"
              value={form.values.price}
              onBlur={() => {
                form.setValues({
                  price: parseFloat(form.values.price).toFixed(2),
                });
              }}
              onChange={(e) => {
                if (e.target.value.at(-1) === "." || e.target.value === "") {
                  form.setValues({ price: e.target.value });
                } else {
                  const val = parseFloat(e.target.value);
                  form.setValues({ price: val.toString() || "" });
                }
              }}
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
            <AppButton label={"Clear"} onClick={() => form.reset()}></AppButton>
            <AppButton label={"Submit"} type="submit"></AppButton>
          </div>
        </form>
      </Modal>
    </>
  );
}
