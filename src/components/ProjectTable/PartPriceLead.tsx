import {
  Checkbox,
  Text,
  getBreakpointValue,
  useMantineTheme,
} from "@mantine/core";
import type { ProjectPart } from "@prisma/client";
import { api } from "../../utils/api";
import { useEffect } from "react";
import { IconLock } from "@tabler/icons-react";
import { useTheme } from "@emotion/react";

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
  if (!part?.id) return <></>;

  let leadTime = 0;
  let price = 0;
  let stock = 0;
  let vendor = "";
  let startDate = new Date("1900-01-01");

  let latestStartDate = new Date("1900-01-01");
  let lowestPrice = 999999999;
  let shortestLead = 999999999;
  let highestStock = 0;

  const theme = useMantineTheme();
  const { data: history } = api.parts.getMostRecentPriceLeadHistory.useQuery(
    part.manufacturerPartId
  );
  const updateSorting = () => {
    if (!history) return;
    switch (sortBy) {
      case "Price":
        console.log("Price");
        history[0]?.VendorPart.forEach((vendorPart) => {
          vendorPart.VendorPartPriceLeadHistory.forEach((priceHistory) => {
            const tempPrice = priceHistory.price;
            if (tempPrice < lowestPrice) {
              vendor = vendorPart.Vendor.name;
              startDate = priceHistory.startDate;
              leadTime = priceHistory.leadTime;
              price = priceHistory.price;
              stock = priceHistory.stock;
              lowestPrice = tempPrice;
            }
          });
        });
        break;
      case "Lead time":
        console.log("Lead Time");
        history[0]?.VendorPart.forEach((vendorPart) => {
          vendorPart.VendorPartPriceLeadHistory.forEach((priceHistory) => {
            const tempLead = priceHistory.leadTime;
            if (tempLead < shortestLead) {
              vendor = vendorPart.Vendor.name;
              startDate = priceHistory.startDate;
              leadTime = priceHistory.leadTime;
              price = priceHistory.price;
              stock = priceHistory.stock;
              shortestLead = tempLead;
            }
          });
        });
        break;
      case "Stock":
        console.log("Stock");
        history[0]?.VendorPart.forEach((vendorPart) => {
          vendorPart.VendorPartPriceLeadHistory.forEach((priceHistory) => {
            const tempStock = priceHistory.stock;
            if (tempStock > highestStock) {
              vendor = vendorPart.Vendor.name;
              startDate = priceHistory.startDate;
              leadTime = priceHistory.leadTime;
              price = priceHistory.price;
              stock = priceHistory.stock;
              highestStock = tempStock;
            }
          });
        });
        break;
      default:
        console.log("Default");
        history[0]?.VendorPart.forEach((vendorPart) => {
          vendorPart.VendorPartPriceLeadHistory.forEach((priceHistory) => {
            const tempDate = new Date(priceHistory.startDate);
            if (tempDate > latestStartDate) {
              vendor = vendorPart.Vendor.name;
              startDate = priceHistory.startDate;
              leadTime = priceHistory.leadTime;
              price = priceHistory.price;
              stock = priceHistory.stock;
              latestStartDate = tempDate;
            }
          });
        });
        break;
    }
  };

  useEffect(() => {
    updateSorting();
  }, [sortBy, history]);

  if (!history) return <></>;

  if (!history[0]?.VendorPart[0]?.VendorPartPriceLeadHistory[0])
    return <Text>No price history</Text>;

  console.log("history", history);
  console.log("leadTime after sort", leadTime);
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
