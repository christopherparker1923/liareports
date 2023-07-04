import { Checkbox, Text, useMantineTheme } from "@mantine/core";
import type { ProjectPart } from "@prisma/client";
import { api } from "../../utils/api";
import { useEffect, useState } from "react";
import { IconLock } from "@tabler/icons-react";
import { AddPartHistoryModal } from "../AddPartHistoryModal";

export default function PartPriceLead({
  part,
  sortBy,
}: {
  part?: ProjectPart & {
    manufacturerPart: {
      partNumber: string;
      manufacturerName: string;
    };
    // vendorPartPriceLeadHistory?: {
    //   price: Number;
    //   leadTime: Number;
    //   stock: Number;
    //   startDate: Date;
    //   vendor: String;
    // };
  };
  sortBy: String;
}) {
  const [vendorPartPriceLeadDisplay, setVendorPartPriceLeadDisplay] = useState<{
    leadTime: Number;
    price: Number;
    stock: Number;
    vendor: String;
    startDate: Date;
    id: string;
  }>({
    leadTime: 0,
    price: 0,
    stock: 0,
    vendor: "",
    startDate: new Date("1900-01-01"),
    id: "",
  });
  const [isChecked, setIsChecked] = useState(
    typeof part?.vendorPartPriceLeadHistoryId === "string" ? true : false
  );
  const theme = useMantineTheme();
  const { data: history } = api.parts.getMostRecentPriceLeadHistory.useQuery(
    part?.manufacturerPartId
  );

  const {
    mutate: assignVendorPartPriceHistoryToProjectPart,
    isLoading: assignVendorPartPriceHistoryToProjectPartisLoading,
  } = api.projectParts.assignVendorPartPriceHistoryToProjectPart.useMutation({
    // onError: (createPartError) => {
    //   console.log("returned error: ", createPartError);
    //   //notifications.clean();
    //   console.log("error");
    //   notifications.show({
    //     title: "Error Creating Part",
    //     message: `${createPartError?.message || "error message unavailable"}`,
    //     icon: <IconX />,
    //     color: "red",
    //     autoClose: 4000,
    //   });
    // },
    // onSuccess: (createPartData) => {
    //   close();
    //   console.log("returned data: ", createPartData);
    //   //notifications.clean();
    //   notifications.show({
    //     title: "Success",
    //     message: `${createPartData?.partNumber || "partNumber unavailable"}`,
    //     icon: <IconCheck />,
    //     color: "green",
    //     autoClose: 4000,
    //   });
    // },
  });

  const { data: getPartHistoryById, isLoading: getPartHistoryByIdIsLoading } =
    api.vendorPartPriceLeadHistory.getPartHistoryById.useQuery(
      part?.vendorPartPriceLeadHistoryId || ""
    );

  const updateSorting = () => {
    if (!history) return;

    let lowestPriceValue = 999999999;
    let shortestLeadValue = 999999999;
    let highestStockValue = 0;
    let latestStartDateValue = new Date("1900-01-01");

    history[0]?.VendorPart.forEach((vendorPart) => {
      vendorPart.VendorPartPriceLeadHistory.forEach((priceHistory) => {
        if (sortBy === "Price") {
          if (
            priceHistory.price < lowestPriceValue ||
            (priceHistory.price === lowestPriceValue &&
              priceHistory.startDate > latestStartDateValue)
          ) {
            lowestPriceValue = priceHistory.price;
            latestStartDateValue = priceHistory.startDate;
            setVendorPartPriceLeadDisplay((prevState) => ({
              ...prevState,
              leadTime: priceHistory.leadTime,
              price: priceHistory.price,
              stock: priceHistory.stock,
              vendor: vendorPart.Vendor.name,
              startDate: priceHistory.startDate,
              id: priceHistory.id,
            }));
          }
        } else if (sortBy === "Lead time") {
          if (
            priceHistory.leadTime < shortestLeadValue ||
            (priceHistory.leadTime === shortestLeadValue &&
              priceHistory.startDate > latestStartDateValue)
          ) {
            shortestLeadValue = priceHistory.leadTime;
            latestStartDateValue = priceHistory.startDate;
            setVendorPartPriceLeadDisplay((prevState) => ({
              ...prevState,
              leadTime: priceHistory.leadTime,
              price: priceHistory.price,
              stock: priceHistory.stock,
              vendor: vendorPart.Vendor.name,
              startDate: priceHistory.startDate,
              id: priceHistory.id,
            }));
          }
        } else if (sortBy === "Stock") {
          if (
            priceHistory.stock > highestStockValue ||
            (priceHistory.stock === highestStockValue &&
              priceHistory.startDate > latestStartDateValue)
          ) {
            highestStockValue = priceHistory.stock;
            latestStartDateValue = priceHistory.startDate;
            setVendorPartPriceLeadDisplay((prevState) => ({
              ...prevState,
              leadTime: priceHistory.leadTime,
              price: priceHistory.price,
              stock: priceHistory.stock,
              vendor: vendorPart.Vendor.name,
              startDate: priceHistory.startDate,
              id: priceHistory.id,
            }));
          }
        } else if (sortBy === "Latest") {
          if (priceHistory.startDate > latestStartDateValue) {
            latestStartDateValue = priceHistory.startDate;
            setVendorPartPriceLeadDisplay((prevState) => ({
              ...prevState,
              leadTime: priceHistory.leadTime,
              price: priceHistory.price,
              stock: priceHistory.stock,
              vendor: vendorPart.Vendor.name,
              startDate: priceHistory.startDate,
              id: priceHistory.id,
            }));
          }
        }
      });
    });
  };

  useEffect(() => {
    updateSorting();
  }, [sortBy, history, part]);

  const handleCheckboxChange = (event) => {
    const newValue = event.currentTarget.checked;
    setIsChecked(newValue);

    // Run your query or perform any action here based on the new checkbox value
    if (newValue) {
      // Checkbox is checked
      assignVendorPartPriceHistoryToProjectPart({
        vendorPartPriceLeadHistoryId: vendorPartPriceLeadDisplay.id,
        projectPartId: part?.id || "",
      });
      // Run your query or perform any action for checked state
    } else {
      assignVendorPartPriceHistoryToProjectPart({
        vendorPartPriceLeadHistoryId: "",
        projectPartId: part?.id || "",
      });
      // Checkbox is unchecked
      // Run your query or perform any action for unchecked state
    }
  };

  if (!part?.id) return <></>;
  if (!history) return <></>;

  if (!history[0]?.VendorPart[0]?.VendorPartPriceLeadHistory[0])
    return (
      <AddPartHistoryModal
        pnum={part.manufacturerPart.partNumber}
        pmanu={part.manufacturerPart.manufacturerName}
      />
    );

  console.log("sortBy: ", sortBy);
  console.log(part.id);
  return (
    <>
      <div className="flex flex-row place-items-center gap-x-1">
        <Text className="w-24">
          {getPartHistoryById != null ??
            (part.vendorPartPriceLeadHistory?.vendor ||
              vendorPartPriceLeadDisplay.vendor)}
        </Text>
        <Text className="w-24">{`$${vendorPartPriceLeadDisplay.price}`}</Text>
        <Text className="w-24">{`${vendorPartPriceLeadDisplay.leadTime} days`}</Text>
        <Text className="w-24">{`${vendorPartPriceLeadDisplay.stock}`}</Text>
        <Text className="w-24">
          {vendorPartPriceLeadDisplay.startDate.toLocaleDateString()}
        </Text>
        <AddPartHistoryModal
          pnum={part?.manufacturerPart.partNumber || ""}
          pmanu={part?.manufacturerPart.manufacturerName || ""}
        />
        <Checkbox
          icon={IconLock}
          indeterminate
          size="sm"
          color={theme.colorScheme === "dark" ? "dark" : "gray"}
          checked={isChecked}
          //onChange={handleCheckboxChange}
          // defaultValue={
          //   typeof part.vendorPartPriceLeadHistoryId === "string" ? true : false
          // }
          // checked={
          //   typeof part.vendorPartPriceLeadHistoryId === "string" ? true : false
          // }
          onChange={(event) => {
            console.log(vendorPartPriceLeadDisplay.id, part.id);
            handleCheckboxChange(event);
          }}
        />
      </div>
    </>
  );
}
