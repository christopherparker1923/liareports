// pages/index.tsx

import {
  Autocomplete,
  Button,
  NumberInput,
  TextInput,
  Text,
} from "@mantine/core"; //hmmm
import type { GetServerSideProps } from "next";
import type { ReactElement } from "react";
import { useCallback, useMemo, useState } from "react";
import { Layout } from "../../../../components/Layout";
import { AppButton } from "../../../../components/AppButton";
import { getBasicServerSideProps } from "../../../../services/getBasicSeverSideProps";
import { api } from "../../../../utils/api";
import type { NextPageWithLayout } from "../../../_app";
import { useSession } from "next-auth/react";

export type PackingSlipPart = {
  partNumber: string;
  description: string | undefined | null;
  manufacturerName: string;
  quantity?: number;
  quantityShipped?: number;
};

type PartLineProps = {
  index: number;
  availableParts: PackingSlipPart[];
  part: PackingSlipPart;
  onPartChange: (index: number, part: PackingSlipPart) => void;
};

function PartFormLine({
  index,
  onPartChange,
  availableParts,
  part,
}: PartLineProps): JSX.Element {
  const handlePartChange =
    <T extends keyof PackingSlipPart>(property: T) =>
    (value: PackingSlipPart[T]) => {
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
            className="border border-gray-500 bg-transparent hover:bg-transparent"
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
      {part.partNumber && (
        <>
          <TextInput
            className="w-2/5"
            variant="filled"
            placeholder="Description"
            value={part.description || ""}
            onChange={(e) => handlePartChange("description")(e.target.value)}
          />
          <NumberInput
            min={0}
            className="w-20"
            defaultValue={1}
            placeholder="Qty"
            value={part.quantity}
            onChange={(value) => {
              handlePartChange("quantity")(value);
              const updatedPart = {
                ...part,
                quantity: value,
                quantityShipped: value,
              };
              onPartChange(index, updatedPart);
            }}
          />
          <NumberInput
            min={0}
            className="w-20"
            defaultValue={1}
            placeholder="Qty"
            value={part.quantityShipped}
            onChange={handlePartChange("quantityShipped")}
          />
        </>
      )}
    </div>
  );
}

const PackingSlip: NextPageWithLayout = () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const { data: sessionData } = useSession();
  const [selectedParts, setSelectedParts] = useState<PackingSlipPart[]>([]);
  const [customer, setCustomer] = useState<string>();
  const [billingAddress, setBillingAddress] = useState<string>();
  const [shippingAddress, setShippingAddress] = useState<string>();
  const [orderDate, setOrderDate] = useState<string>(formattedDate);
  const [orderNumber, setOrderNumber] = useState<string>();

  const [purchaseOrder, setPurchaseOrder] = useState<string>();
  const [customerContact, setCustomerContact] = useState<string>();
  const [postComment, setPostComment] = useState<string>();
  const [watermark, setWatermark] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [userPhone, setUserPhone] = useState<string>();
  const [userEmail, setUserEmail] = useState<string>();
  const [watermarkColor, setWatermarkColor] = useState<string>();

  const onPartChange = useCallback(
    (index: number, part: PackingSlipPart) => {
      setSelectedParts((parts) => {
        if (index === parts.length) {
          return [...parts, part];
        } else {
          return parts
            .map((value, i) => (i === index ? part : value))
            .filter((part) => part.partNumber !== "");
        }
      });
    },
    [setSelectedParts]
  );
  const { data } = api.parts.getAllParts.useQuery();
  const availableParts = useMemo(
    () =>
      data
        ?.filter(
          (part) =>
            selectedParts.findIndex(
              (selectedPart) => selectedPart.partNumber === part.partNumber
            ) === -1
        )
        .map((part) => ({ ...part, quantity: 1 })) || [],
    [selectedParts, data]
  );

  return (
    //Put in a flex box with 2 inputs per row
    <>
      <TextInput
        value={customer}
        label="Customer ID"
        placeholder="e.g. TMMC"
        onChange={(event) => setCustomer(event.currentTarget.value)}
      />
      <TextInput
        value={customerContact}
        label="Customer Contact"
        placeholder="Purchasing Dept."
        onChange={(event) => setCustomerContact(event.currentTarget.value)}
      />
      <TextInput
        value={billingAddress}
        label="Billing Address"
        placeholder="e.g Same as Shipping"
        defaultValue={"Same as Shipping"}
        onChange={(event) => setBillingAddress(event.currentTarget.value)}
      />
      <TextInput
        value={shippingAddress}
        label="Shipping Address"
        placeholder="e.g. TMMC 1055 Fountain St, Cambridge ON"
        onChange={(event) => setShippingAddress(event.currentTarget.value)}
      />
      <TextInput
        value={orderDate}
        label="Order Date"
        placeholder=""
        defaultValue={formattedDate}
        onChange={(event) => setOrderDate(event.currentTarget.value)}
      />
      <TextInput
        value={orderNumber}
        label="Order Number"
        placeholder="[123456]"
        onChange={(event) => setOrderNumber(event.currentTarget.value)}
      />
      <TextInput
        value={purchaseOrder}
        label="Purchase Order"
        placeholder="[123456]"
        onChange={(event) => setPurchaseOrder(event.currentTarget.value)}
      />

      <TextInput
        value={userName}
        label="LIA Contact Name"
        placeholder="Your Name"
        defaultValue={sessionData?.user.name ?? ""}
        onChange={(event) => setUserName(event.currentTarget.value)}
      />
      <TextInput
        value={userPhone}
        label="LIA Contact Number"
        placeholder="Your Phone Number" //Add sessionData.user.phoneNumber
        onChange={(event) => setUserPhone(event.currentTarget.value)}
      />
      <TextInput
        value={userEmail}
        label="LIA Contact Email"
        placeholder="Your Email"
        defaultValue={sessionData?.user.email ?? ""}
        onChange={(event) => setUserEmail(event.currentTarget.value)}
      />
      <TextInput
        value={postComment}
        label="Comment"
        placeholder="Appears in large 'Comments' box"
        onChange={(event) => setPostComment(event.currentTarget.value)}
      />
      <TextInput
        value={watermark}
        label="Watermark"
        placeholder="Appears translucent & angled across parts"
        onChange={(event) => setWatermark(event.currentTarget.value)}
      />
      <TextInput
        value={watermarkColor}
        label="Watermark Color"
        placeholder="Defaults to grey; 'red', 'green' are options" //Add autocomplete to pick from legal colours
        onChange={(event) => setWatermarkColor(event.currentTarget.value)}
      />
      <div className="my-1 flex w-full justify-between gap-x-1">
        <Text className="flex w-2/5 flex-row" size="sm">
          Parts
        </Text>
        <Text className="flex w-2/5 flex-row" size="sm">
          Description
        </Text>
        <Text className="w-20" size="sm">
          Quantity Ordered
        </Text>
        <Text className="w-20" size="sm">
          Quantity Shipped
        </Text>
      </div>

      <div className="h-full">
        {[
          ...selectedParts,
          {
            partNumber: "",
            description: "",
            manufacturerName: "",
            quantity: 1,
          },
        ].map((part, index) => (
          <PartFormLine
            part={part}
            key={index}
            availableParts={availableParts}
            index={index}
            onPartChange={onPartChange}
          />
        ))}
        <AppButton
          label="Generate"
          onClick={async () => {
            return void (await (
              await import("../../../../utils/generatePackingSlip")
            ).generatePackingSlip(
              selectedParts,
              customer,
              billingAddress,
              shippingAddress,
              orderDate,
              orderNumber,
              purchaseOrder,
              customerContact,
              postComment,
              watermark,
              userName,
              userPhone,
              userEmail,
              watermarkColor
            ));
          }}
        />
      </div>
    </>
  );
};

PackingSlip.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default PackingSlip;
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
