import { Card, Divider, Text } from "@mantine/core";
import type { GetServerSideProps } from "next";
import { ReactElement, useState } from "react";
import { Layout } from "../../../../components/Layout";
import { getBasicServerSideProps } from "../../../../services/getBasicSeverSideProps";
import type { NextPageWithLayout } from "../../../_app";
import { useRouter } from "next/router";
import { AddPartHistoryModal } from "../../../../components/AddPartHistoryModal";
import { PlotPartHistory } from "../../../../components/PlotPartHistory";
import { useDisclosure } from "@mantine/hooks";
import { AppButton } from "../../../../components/AppButton";
import { api } from "../../../../utils/api";
import { VendorPart, VendorPartPriceLeadHistory } from "@prisma/client";

const PartDetailView: NextPageWithLayout = () => {
  const router = useRouter();
  const { pnum, pmanu } = router.query as { pmanu: string; pnum: string };
  const [sortedVendorPartHistory, setSortedVendorPartHistory] = useState<
    VendorPartPriceLeadHistory[]
  >([]);
  const { data: manufacturerPart } =
    api.parts.getManuPartFromNumberAndManu.useQuery({
      partNumber: pnum,
      manuName: pmanu,
    });
  const allVendorsHistory = api.vendorParts.getVendorPartsOfManuPart.useQuery({
    partNumber: pnum,
    manuName: pmanu,
  });

  function sortVendorPartPriceLeadHistoryByStartDate(
    leadHistoryList: VendorPartPriceLeadHistory[]
  ) {
    return leadHistoryList.sort((a, b) => {
      if (a.startDate < b.startDate) {
        return -1;
      } else if (a.startDate > b.startDate) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  if (!pnum) return <div>Invalid part id</div>;
  if (manufacturerPart === undefined || manufacturerPart === null)
    return <div>Loading manufacturer part</div>;
  return (
    <>
      <div className="flex content-center justify-between">
        <div className="flex content-center items-center justify-start">
          <Text className="" size="sm">
            {/* Placeholder <br />
            for Image */}
          </Text>
          <Text className="mr-2" size="xl">
            {pmanu}
          </Text>
          <Text size="xl">{pnum}</Text>
        </div>
        <AddPartHistoryModal pnum={pnum} pmanu={pmanu} />
      </div>
      <Text className="mb-2" size="md">
        {manufacturerPart?.part?.description}
      </Text>
      <div>
        <div className="flex flex-wrap gap-2">
          {allVendorsHistory.data?.map((vendorInstance) => {
            const sortedVendorPartHistory =
              sortVendorPartPriceLeadHistoryByStartDate(
                vendorInstance.VendorPartPriceLeadHistory
              );
            const plotProps = sortedVendorPartHistory.map((history) => ({
              date: history.startDate,
              price: history.price,
              leadTime: history.leadTime,
              stock: history.stock,
            }));
            return (
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                key={vendorInstance.vendorId}
              >
                <Card.Section>
                  <Text className="p-2" size="xl" color="dimmed">
                    {vendorInstance.Vendor.name}
                  </Text>
                </Card.Section>
                <Divider variant="solid" />
                <Card.Section className="pt-2">
                  <PlotPartHistory plotProps={plotProps} />
                </Card.Section>
              </Card>
            );
          })}
        </div>
        <Card className="mt-2" shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section>
            <Text className="p-2" size="xl">
              Specifications
            </Text>
          </Card.Section>
          <Divider variant="solid" />
          <Card.Section className="pt-2">
            <div className="flex">
              <Text className="w-1/5 p-2">{`Height: ${manufacturerPart.part?.height}`}</Text>
              <Text className="w-1/5 p-2">{`UL Cert: ${manufacturerPart.part?.ULCert}`}</Text>
              <Text className="w-1/5 p-2">{`Part Type: ${manufacturerPart.part?.partType}`}</Text>
              <Text className="w-1/5 p-2">{`Preference: ${manufacturerPart.part?.preference}`}</Text>
            </div>
            <div className="flex">
              <Text className="w-1/5 p-2">{`Width (Radius): ${manufacturerPart.part?.width}`}</Text>
              <Text className="w-1/5 p-2">{`CSA Cert: ${manufacturerPart.part?.CSACert}`}</Text>
            </div>
            <div className="flex">
              <Text className="w-1/5 p-2">{`Depth (Length): ${manufacturerPart.part?.length}`}</Text>
            </div>
          </Card.Section>
        </Card>
        <Card className="mt-2" shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section>
            <Text className="p-2" size="xl">
              Part Tags
            </Text>
          </Card.Section>
          <Divider variant="solid" />
          <Card.Section className="pt-2">
            <div className="flex">
              {manufacturerPart.part?.partTags?.map((tag) => {
                return (
                  <Text className="w-1/5 p-2" key={tag.id}>
                    {tag.name}
                  </Text>
                );
              })}
            </div>
          </Card.Section>
        </Card>
        <Card className="mt-2" shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section>
            <Text className="p-2" size="xl">
              Projects
            </Text>
          </Card.Section>
          <Divider variant="solid" />
          <Card.Section className="pt-2">
            {Object.entries(manufacturerPart.projectPartCounts).map(
              ([key, value]) => (
                <div className="flex" key={key}>
                  <Text className="w-1/5 p-2">{key}</Text>
                  <Text className="w-1/5 p-2">Lead: {value.lead}</Text>
                  <Text className="w-1/5 p-2">Quantity: {value.count}</Text>
                </div>
              )
            )}
          </Card.Section>
        </Card>

        {/* //<PlotPartHistory plotProps={props} /> */}
      </div>
    </>
  );
};

PartDetailView.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default PartDetailView;
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
