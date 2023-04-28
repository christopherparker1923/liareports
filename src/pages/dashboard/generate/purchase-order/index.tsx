// pages/index.tsx

import {
  Autocomplete,
  Button,
  NumberInput,
  TextInput,
  Text,
  AutocompleteItem,
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
import { Prisma, Project } from "@prisma/client";

type VendorPartWithHistory = Prisma.VendorGetPayload<{
  include: {
    vendorParts: {
      include: {
        VendorPartPriceLeadHistory: {
          select: {
            price: true;
          };
        };
        ManufacturerPart: {
          select: {
            manufacturerName: true;
            partNumber: true;
            description: true;
          };
        };
      };
    };
  };
}>;

export type ProjectAutocompleteItem = AutocompleteItem & Project;

export type VendorAutocompleteItem = AutocompleteItem & VendorPartWithHistory;

export type PurchaseOrderPart = {
  quantity: number;
  unit: string;
  partNumber: string;
  description: string | undefined | null;
  manufacturerName: string;
  unitPrice: number;
};

type PartLineProps = {
  index: number;
  availableParts: PurchaseOrderPart[];
  part: PurchaseOrderPart;
  onPartChange: (index: number, part: PurchaseOrderPart) => void;
};

const waterMarkColours = [
  { value: "red" },
  { value: "blue" },
  //{ value: "rhino" },
  // { value: "puertoRico" },
  // { value: "neptune" },
  //{ value: "shuttleGray" },
  //{ value: "blackSqueeze" },
  //{ value: "santasGray" },
  //{ value: "powderBlue" },
  //{ value: "osloGray" },
  // { value: "towerGray" },
  { value: "green" },
];

function PartFormLine({
  index,
  onPartChange,
  availableParts,
  part,
}: PartLineProps): JSX.Element {
  const handlePartChange =
    <T extends keyof PurchaseOrderPart>(property: T) =>
    (value: PurchaseOrderPart[T]) => {
      // Find the part with the same part number, if it exists
      const updatedPart = availableParts.find(
        (part) => part.partNumber === value
      ) || { ...part, [property]: value };
      // Call the onPartChange function with the updated part and the index
      onPartChange(index, updatedPart);
    };
  return (
    <div key={index} className="my-1 flex w-full justify-between gap-x-1">
      <div className="flex w-1/6 flex-row">
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
                quantity: 1,
                unit: "",
                partNumber: "",
                description: "",
                manufacturerName: "",
                unitPrice: 0,
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
            className="w-2/5 grow"
            variant="filled"
            placeholder="Description"
            value={part.description || ""}
            onChange={(e) => handlePartChange("description")(e.target.value)}
          />
          <TextInput
            className="w-1/6"
            variant="filled"
            placeholder="Manufacturer"
            value={part.manufacturerName || ""}
            onChange={(e) =>
              handlePartChange("manufacturerName")(e.target.value)
            }
          />
          <NumberInput
            min={0}
            className="w-20"
            defaultValue={1}
            placeholder="Qty"
            value={part.quantity}
            onChange={(e) => handlePartChange("quantity")(e || 0)}
          />
          <TextInput
            className="w-20"
            variant="filled"
            placeholder="Unit Size"
            value={part.unit || ""}
            onChange={(e) => handlePartChange("unit")(e.target.value)}
          />
          <NumberInput
            min={0}
            className="w-20"
            defaultValue={1}
            variant="filled"
            placeholder="Price"
            value={part.unitPrice}
            hideControls={true}
            onChange={(e) => handlePartChange("unitPrice")(e || 0)}
          />
        </>
      )}
    </div>
  );
}

const PurchaseOrder: NextPageWithLayout = () => {
  const currentDate = new Date();
  const [selectedVendor, setSelectedVendor] = useState<
    VendorAutocompleteItem | undefined
  >(undefined);
  const [selectedProject, setSelectedProject] = useState<
    ProjectAutocompleteItem | undefined
  >(undefined);
  const formattedDate = currentDate.toLocaleDateString();
  const [deliveryDate, setDeliveryDate] = useState<string>();
  const { data: sessionData } = useSession();
  const [selectedParts, setSelectedParts] = useState<PurchaseOrderPart[]>([]);
  const [shippingMethod, setShippingMethod] = useState<string>();
  const [shippingTerms, setShippingTerms] = useState<string>();
  const [orderDate, setOrderDate] = useState<string>(formattedDate);
  const [orderNumber, setOrderNumber] = useState<string>();
  const [shipTo, setShipTo] = useState<string>();
  const [authorizedBy, setAuthorizedBy] = useState<string>();
  const [purchaseOrder, setPurchaseOrder] = useState<string>();
  const [postComment, setPostComment] = useState<string>();
  const [watermark, setWatermark] = useState<string>();
  const [watermarkColor, setWatermarkColor] = useState<string>();

  const { data: allVendors } = api.vendors.getAllVendorInfo.useQuery();
  const { data: allProjects } = api.projects.getAllProjects.useQuery();
  const vendorOptions = allVendors?.map((vendor) => ({
    value: vendor.name,
    ...vendor,
  }));
  // type Test = (typeof vendorOptions)?.[number];

  const onPartChange = useCallback(
    (index: number, part: PurchaseOrderPart) => {
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

  const availableParts = useMemo(
    () =>
      selectedVendor?.vendorParts
        ?.filter(
          (part) =>
            selectedParts.findIndex(
              (selectedPart) =>
                selectedPart.partNumber === part.ManufacturerPart.partNumber
            ) === -1
        )
        .map((part) => ({
          quantity: 1,
          unit: "EA",
          partNumber: part.ManufacturerPart.partNumber,
          description: part.ManufacturerPart.description,
          manufacturerName: part.ManufacturerPart.manufacturerName,
          unitPrice: part.VendorPartPriceLeadHistory[0]?.price || 0,
        })) || [],
    [selectedParts, selectedVendor]
  );

  const availableProjects = allProjects?.map((project) => ({
    value: project.projectNumber,
  }));

  return (
    //Put in a flex box with 2 inputs per row
    <>
      <div className="flex flex-wrap gap-5">
        <Autocomplete
          label="Select a vendor"
          placeholder="Aztec"
          data={vendorOptions || []}
          onItemSubmit={(selectedVendor: VendorAutocompleteItem) =>
            setSelectedVendor(selectedVendor)
          }
        />
        <Autocomplete
          label="Select a project"
          placeholder=""
          data={availableProjects || []}
          onItemSubmit={(selectedProject: ProjectAutocompleteItem) =>
            setSelectedProject(selectedProject)
          }
        />
        <TextInput
          value={purchaseOrder}
          label="Purchase Order"
          placeholder="[123456]"
          onChange={(event) => setPurchaseOrder(event.currentTarget.value)}
        />
        <TextInput
          value={orderDate}
          label="Order Date"
          placeholder=""
          defaultValue={formattedDate}
          onChange={(event) => setOrderDate(event.currentTarget.value)}
        />
        <TextInput
          value={deliveryDate}
          label="Delivery Date"
          placeholder="ASAP"
          defaultValue={deliveryDate}
          onChange={(event) => setDeliveryDate(event.currentTarget.value)}
        />
        <TextInput
          value={orderNumber}
          label="Order Number"
          placeholder="[123456]"
          onChange={(event) => setOrderNumber(event.currentTarget.value)}
        />
        <TextInput
          value={shipTo}
          label="Ship To"
          placeholder="Hold for pickup"
          onChange={(event) => setShipTo(event.currentTarget.value)}
        />
        <TextInput
          value={shippingMethod}
          label="Shipping Method"
          placeholder="Hold for pickup"
          onChange={(event) => setShippingMethod(event.currentTarget.value)}
        />
        <TextInput
          value={shippingTerms}
          label="Shipping Terms"
          placeholder="Ship complete"
          onChange={(event) => setShippingTerms(event.currentTarget.value)}
        />
        <TextInput
          value={authorizedBy}
          label="Authorized By (Name)"
          placeholder="Your Name"
          defaultValue={sessionData?.user.name ?? ""}
          onChange={(event) => setAuthorizedBy(event.currentTarget.value)}
        />
        <TextInput
          value={postComment}
          label="Comment"
          placeholder=""
          onChange={(event) => setPostComment(event.currentTarget.value)}
        />
        <TextInput
          value={watermark}
          label="Watermark"
          placeholder="Appears translucent & angled across parts"
          onChange={(event) => setWatermark(event.currentTarget.value)}
        />
        <Autocomplete
          data={waterMarkColours}
          limit={50}
          value={watermarkColor}
          label="Watermark Color"
          placeholder="Defaults to grey" //Add autocomplete to pick from legal colours
          onChange={(value) => setWatermarkColor(value)}
        />
      </div>
      <div className="my-1 flex w-full justify-between gap-x-1">
        <Text className="flex w-1/6 flex-row" size="sm">
          Parts
        </Text>
        <Text className="flex w-2/5 grow flex-row" size="sm">
          Description
        </Text>
        <Text className="flex w-1/6 flex-row" size="sm">
          Manufacturer
        </Text>
        <Text className="flex w-20 flex-row" size="sm">
          Quantity
        </Text>
        <Text className="w-20" size="sm">
          Unit
        </Text>
        <Text className="w-20" size="sm">
          Price
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
            unit: "",
            unitPrice: 0,
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
            if (!selectedVendor) return console.log("No vendor selected error");
            return void (await (
              await import("../../../../utils/generatePurchaseOrder")
            ).generatePurchaseOrder({
              parts: selectedParts,
              vendor: selectedVendor,
              orderDate: formattedDate,
              purchaseOrder: purchaseOrder || "",
              postComment: postComment || "",
              shipTo: shipTo || "",
              shippingMethod: shippingMethod || "",
              shippingTerms: shippingTerms || "",
              deliveryDate: deliveryDate || "",
              jobNumber: selectedProject?.projectNumber || "",
              authorizedBy: authorizedBy || "",
              watermark: watermark || "",
              watermarkColor: watermarkColor || "shuttleGrey",
            }));
          }}
        />
      </div>
    </>
  );
};

PurchaseOrder.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default PurchaseOrder;
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
