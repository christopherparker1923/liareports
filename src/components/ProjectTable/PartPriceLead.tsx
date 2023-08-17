import {
  Checkbox,
  Flex,
  HoverCard,
  Text,
  useMantineTheme,
} from "@mantine/core";
import type { ProjectPart } from "@prisma/client";
import { api } from "../../utils/api";
import { ChangeEvent, useEffect, useState, useMemo } from "react";

import { IconLock, IconX, IconCheck } from "@tabler/icons-react";
import { AddPartHistoryModal } from "../AddDataModals/AddPartHistoryModal";
import { notifications } from "@mantine/notifications";

export default function PartPriceLead({
  part,
  sortBy,
  projectNumber,
}: {
  part?: ProjectPart & {
    manufacturerPart: {
      partNumber: string;
      manufacturerName: string;
    };
  };
  sortBy: string;
  projectNumber: string;
}) {
  const [vendorPartPriceLeadDisplay, setVendorPartPriceLeadDisplay] = useState<{
    leadTime: number;
    price: number;
    stock: number;
    vendor: string;
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

  const [dummyState, setDummyState] = useState(false);

  const utils = api.useContext();
  const theme = useMantineTheme();
  const { data: history } = api.parts.getMostRecentPriceLeadHistory.useQuery(
    part?.manufacturerPartId
  );

  const {
    mutate: assignVendorPartPriceHistoryToProjectPart,
    isLoading: assignVendorPartPriceHistoryToProjectPartisLoading,
  } = api.projectParts.assignVendorPartPriceHistoryToProjectPart.useMutation({
    onError: (error) => {
      notifications.clean();
      notifications.show({
        title: "Error Creating Part",
        message: `${error?.message || "error message unavailable"}`,
        icon: <IconX />,
        color: "red",
        autoClose: 4000,
      });
    },
    onSuccess: (data) => {
      // refetchGetPartHistoryById();
      notifications.clean();
      notifications.show({
        title: "Success",
        message: `${data?.vendorPartPriceLeadHistoryId || "Part unlocked"}`,
        icon: <IconCheck />,
        color: "green",
        autoClose: 4000,
      });
    },
  });

  const {
    data: getPartHistoryById,
    isLoading: getPartHistoryByIdIsLoading,
    refetch: refetchGetPartHistoryById,
  } = api.vendorPartPriceLeadHistory.getPartHistoryById.useQuery(
    part?.vendorPartPriceLeadHistoryId || ""
  );

  const [isChecked, setIsChecked] = useState(
    part?.vendorPartPriceLeadHistoryId ? true : false
  );

  //updateSorting uses sortBy to determine which piece of the history data to prioritize for display
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

  const handleCheckboxChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.checked;
    setIsChecked(newValue);

    // Open a notification indicating that the mutation to link project part to part history is loading
    notifications.show({
      title: "Loading",
      message: "",
      loading: true,
      autoClose: false,
    });

    // Run your query or perform any action here based on the new checkbox value
    if (newValue) {
      // Checkbox is checked
      console.log("Positive Check transition, ", vendorPartPriceLeadDisplay.id);
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

    await utils.projects.getProjectChildrenByProjectNumber.invalidate(
      projectNumber
    );
    await refetchGetPartHistoryById();
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

  return (
    <>
      <div className="flex flex-row place-items-center gap-x-1">
        {part?.vendorPartPriceLeadHistoryId ? (
          <Flex
            wrap="wrap"
            justify="center"
            align="center"
            gap="md"
            direction="row"
            className="mx-4"
          >
            {/* <div className="flex flex-row place-items-center gap-x-1"> */}
            <Text>{`${
              getPartHistoryById?.Vendor?.vendorPart?.Vendor.name || ""
            }`}</Text>
            <Text>{`$${
              getPartHistoryById?.History?.price.toString() || ""
            }`}</Text>
            <Text>{`${
              getPartHistoryById?.History?.leadTime.toString() || ""
            } days`}</Text>
            <Text>{`${
              getPartHistoryById?.History?.stock.toString() || ""
            }`}</Text>
            <Text>
              {getPartHistoryById?.History?.startDate.toLocaleDateString()}
            </Text>
            {/* </div> */}
          </Flex>
        ) : (
          <Flex
            wrap="wrap"
            justify="center"
            align="center"
            gap="md"
            direction="row"
            className="mx-4"
          >
            {/* <div className="flex flex-row place-items-center gap-x-1"> */}
            <Text>{`${vendorPartPriceLeadDisplay.vendor}`}</Text>
            <Text>{`$${vendorPartPriceLeadDisplay.price.toString()}`}</Text>
            <HoverCard>
              <HoverCard.Target>
                <Text>{`${vendorPartPriceLeadDisplay.leadTime.toString()} days`}</Text>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Text>Lead Time</Text>
              </HoverCard.Dropdown>
            </HoverCard>
            <HoverCard>
              <HoverCard.Target>
                <Text>{`${vendorPartPriceLeadDisplay.stock.toString()}`}</Text>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Text>Vendor Stock</Text>
              </HoverCard.Dropdown>
            </HoverCard>
            <Text>
              {vendorPartPriceLeadDisplay.startDate.toLocaleDateString()}
            </Text>
            {/* </div> */}
          </Flex>
        )}
        <AddPartHistoryModal
          pnum={part?.manufacturerPart.partNumber || ""}
          pmanu={part?.manufacturerPart.manufacturerName || ""}
        />
        <HoverCard>
          <HoverCard.Target>
            <Checkbox
              icon={IconLock}
              indeterminate
              size="xl"
              color={theme.colorScheme === "dark" ? "dark" : "gray"}
              checked={isChecked}
              onChange={async (event) => {
                await handleCheckboxChange(event);
                setDummyState(!dummyState);
              }}
            />
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Text>Lock Quote</Text>
          </HoverCard.Dropdown>
        </HoverCard>
      </div>
    </>
  );
}
