import { Checkbox, Text, useMantineTheme } from "@mantine/core";
import type { ProjectPart } from "@prisma/client";
import { api } from "../../utils/api";
import { useEffect, useState } from "react";
import { IconLock } from "@tabler/icons-react";

export default function PartPriceLead({
  part,
  sortBy,
}: {
  part?: ProjectPart & {
    manufacturerPart: {
      partNumber: string;
    };
  };
  sortBy: String;
}) {
  const [leadTime, setLeadTime] = useState(0);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [vendor, setVendor] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date("1900-01-01"));

  const [shortestLead, setShortestLead] = useState(999999999);
  const [lowestPrice, setLowestPrice] = useState(999999999);
  const [highestStock, setHighestStock] = useState(0);
  const [latestStartDate, setLatestStartDate] = useState<Date>(
    new Date("1900-01-01")
  );

  const [tempPrice, setTempPrice] = useState(0);
  const [tempLead, setTempLead] = useState(0);
  const [tempStock, setTempStock] = useState(0);
  const [tempDate, setTempDate] = useState<Date>(new Date("1900-01-01"));

  const theme = useMantineTheme();
  const { data: history } = api.parts.getMostRecentPriceLeadHistory.useQuery(
    part?.manufacturerPartId
  );
  const updateSorting = () => {
    if (!history) return;
    switch (sortBy) {
      case "Price":
        console.log("Price");
        history[0]?.VendorPart.forEach((vendorPart) => {
          vendorPart.VendorPartPriceLeadHistory.forEach((priceHistory) => {
            setTempPrice(priceHistory.price);
            console.log("iterating through history");
            if (tempPrice < lowestPrice) {
              console.log("updating based on price sort");
              setVendor(vendorPart.Vendor.name);
              setStartDate(priceHistory.startDate);
              setLeadTime(priceHistory.leadTime);
              setPrice(priceHistory.price);
              setStock(priceHistory.stock);
              setLowestPrice(tempPrice);
            }
          });
        });
        break;
      case "Lead time":
        console.log("Lead Time");
        history[0]?.VendorPart.forEach((vendorPart) => {
          vendorPart.VendorPartPriceLeadHistory.forEach((priceHistory) => {
            setTempLead(priceHistory.leadTime);
            if (tempLead < shortestLead) {
              setVendor(vendorPart.Vendor.name);
              setStartDate(priceHistory.startDate);
              setLeadTime(priceHistory.leadTime);
              setPrice(priceHistory.price);
              setStock(priceHistory.stock);
              setShortestLead(tempLead);
            }
          });
        });
        break;
      case "Stock":
        console.log("Stock");
        history[0]?.VendorPart.forEach((vendorPart) => {
          vendorPart.VendorPartPriceLeadHistory.forEach((priceHistory) => {
            setTempStock(priceHistory.stock);
            if (tempStock > highestStock) {
              setVendor(vendorPart.Vendor.name);
              setStartDate(priceHistory.startDate);
              setLeadTime(priceHistory.leadTime);
              setPrice(priceHistory.price);
              setStock(priceHistory.stock);
              setHighestStock(tempStock);
            }
          });
        });
        break;
      default:
        console.log("Default");
        history[0]?.VendorPart.forEach((vendorPart) => {
          vendorPart.VendorPartPriceLeadHistory.forEach((priceHistory) => {
            setTempDate(priceHistory.startDate);
            if (tempDate > latestStartDate) {
              setVendor(vendorPart.Vendor.name);
              setStartDate(priceHistory.startDate);
              setLeadTime(priceHistory.leadTime);
              setPrice(priceHistory.price);
              setStock(priceHistory.stock);
              setLatestStartDate(tempDate);
            }
          });
        });
        break;
    }
  };

  useEffect(() => {
    updateSorting();
  }, [sortBy, history]);

  if (!part?.id) return <></>;
  if (!history) return <></>;

  if (!history[0]?.VendorPart[0]?.VendorPartPriceLeadHistory[0])
    return <Text>No price history</Text>;
  return (
    <>
      <div className="flex flex-row place-items-center gap-x-1">
        <Text className="w-24">{vendor}</Text>
        <Text className="w-24">{`$${price}`}</Text>
        <Text className="w-24">{`${leadTime} days`}</Text>
        <Text className="w-24">{stock}</Text>
        <Text className="w-24">{startDate.toLocaleDateString()}</Text>
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
