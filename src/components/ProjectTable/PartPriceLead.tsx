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
  };
  sortBy: String;
}) {
  const [vendorPartPriceLeadDisplay, setVendorPartPriceLeadDisplay] = useState<{
    leadTime: Number;
    price: Number;
    stock: Number;
    vendor: String;
    startDate: Date;
  }>({
    leadTime: 0,
    price: 0,
    stock: 0,
    vendor: "",
    startDate: new Date("1900-01-01"),
  });

  const [shortestLead, setShortestLead] = useState(999999999);
  const [lowestPrice, setLowestPrice] = useState(999999999);
  const [highestStock, setHighestStock] = useState(0);
  const [latestStartDate, setLatestStartDate] = useState<Date>(
    new Date("1900-01-01")
  );

  const theme = useMantineTheme();
  const { data: history } = api.parts.getMostRecentPriceLeadHistory.useQuery(
    part?.manufacturerPartId
  );
  const updateSorting = () => {
    if (!history) return;
    console.log(history);
    switch (sortBy) {
      case "Price":
        setLowestPrice(999999999);
        console.log("This is the price data that is working");
        console.log(part);
        console.log(history);
        console.log(history.length);
        history[0]?.VendorPart.forEach((vendorPart) => {
          console.log(vendorPart.id);
          vendorPart.VendorPartPriceLeadHistory.forEach((priceHistory) => {
            console.log(priceHistory.id);
            console.log(priceHistory.price);
            if (priceHistory.price < lowestPrice) {
              console.log("updating based on price sort");
              setVendorPartPriceLeadDisplay({
                leadTime: priceHistory.leadTime,
                price: priceHistory.price,
                stock: priceHistory.stock,
                vendor: vendorPart.Vendor.name,
                startDate: priceHistory.startDate,
              });
              setLowestPrice(priceHistory.price);
            }
          });
        });
        break;
      case "Lead time":
        setShortestLead(999999999);
        history[0]?.VendorPart.forEach((vendorPart) => {
          vendorPart.VendorPartPriceLeadHistory.forEach((priceHistory) => {
            if (priceHistory.leadTime < shortestLead) {
              setVendorPartPriceLeadDisplay({
                leadTime: priceHistory.leadTime,
                price: priceHistory.price,
                stock: priceHistory.stock,
                vendor: vendorPart.Vendor.name,
                startDate: priceHistory.startDate,
              });
              setShortestLead(priceHistory.leadTime);
            }
          });
        });
        break;
      case "Stock":
        setHighestStock(0);
        history[0]?.VendorPart.forEach((vendorPart) => {
          vendorPart.VendorPartPriceLeadHistory.forEach((priceHistory) => {
            if (priceHistory.stock > highestStock) {
              setVendorPartPriceLeadDisplay({
                leadTime: priceHistory.leadTime,
                price: priceHistory.price,
                stock: priceHistory.stock,
                vendor: vendorPart.Vendor.name,
                startDate: priceHistory.startDate,
              });
              setHighestStock(priceHistory.stock);
            }
          });
        });
        break;
      default:
        setLatestStartDate(new Date("1900-01-01"));
        history[0]?.VendorPart.forEach((vendorPart) => {
          vendorPart.VendorPartPriceLeadHistory.forEach((priceHistory) => {
            if (priceHistory.startDate > latestStartDate) {
              setVendorPartPriceLeadDisplay({
                leadTime: priceHistory.leadTime,
                price: priceHistory.price,
                stock: priceHistory.stock,
                vendor: vendorPart.Vendor.name,
                startDate: priceHistory.startDate,
              });
              setLatestStartDate(priceHistory.startDate);
            }
          });
        });
        break;
    }
  };

  useEffect(() => {
    updateSorting();
  }, [sortBy, history, part]);

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
        <Text className="w-24">{vendorPartPriceLeadDisplay.vendor}</Text>
        <Text className="w-24">{`$${vendorPartPriceLeadDisplay.price}`}</Text>
        <Text className="w-24">{`${vendorPartPriceLeadDisplay.leadTime} days`}</Text>
        <Text className="w-24">{`${vendorPartPriceLeadDisplay.stock}`}</Text>
        <Text className="w-24">
          {vendorPartPriceLeadDisplay.startDate.toLocaleDateString()}
        </Text>
        <AddPartHistoryModal
          pnum={part.manufacturerPart.partNumber}
          pmanu={part.manufacturerPart.manufacturerName}
        />
        <Checkbox
          icon={IconLock}
          indeterminate
          size="sm"
          color={theme.colorScheme === "dark" ? "dark" : "gray"}
          //onChange={}
        />
      </div>
    </>
  );
}
