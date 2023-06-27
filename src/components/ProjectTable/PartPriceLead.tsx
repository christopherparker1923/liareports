import { Text, getBreakpointValue } from "@mantine/core";
import type { ProjectPart } from "@prisma/client";
import { api } from "../../utils/api";
import { useEffect } from "react";

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

  const { data: history } = api.parts.getMostRecentPriceLeadHistory.useQuery(
    part.manufacturerPartId
  );

  const updateSorting = () => {
    if (!history) return;
    switch (sortBy) {
      case "price":
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
      case "lead":
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
      case "stock":
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

  let leadTime = 0;
  let price = 0;
  let stock = 0;
  let vendor = "";
  let startDate = new Date("1900-01-01");

  let latestStartDate = new Date("1900-01-01");
  let lowestPrice = 999999999;
  let shortestLead = 999999999;
  let highestStock = 0;

  console.log(history);
  return (
    <>
      <div className="flex flex-row gap-x-1">
        <Text className="w-24">{vendor}</Text>
        <Text className="w-24">{`$${price}`}</Text>
        <Text className="w-24">{`${leadTime} days`}</Text>
        <Text className="w-24">{stock}</Text>
        <Text className="w-24">{startDate.toLocaleDateString()}</Text>
      </div>
    </>
  );
}
