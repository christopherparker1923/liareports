import { Text } from "@mantine/core";
import type { GetServerSideProps } from "next";
import { ReactElement } from "react";
import { Layout } from "../../../../components/Layout";
import { getBasicServerSideProps } from "../../../../services/getBasicSeverSideProps";
import type { NextPageWithLayout } from "../../../_app";
import { useRouter } from "next/router";
import { AddPartHistoryModal } from "../../../../components/AddPartHistoryModal";
import { PlotPartHistory } from "../../../../components/PlotPartHistory";
import { useDisclosure } from "@mantine/hooks";
import { AppButton } from "../../../../components/AppButton";

const PartDetailView: NextPageWithLayout = () => {
  const router = useRouter();
  const { pnum, pmanu } = router.query as { pmanu: string; pnum: string };
  const props = [
    { date: "march 3", price: 500, leadTime: 10, stock: 2 },
    { date: "march 10", price: 700, leadTime: 11, stock: 9 },
  ];

  if (!pnum) return <div>Invalid part id</div>;
  return (
    <>
      <div className="flex justify-between">
        <div className="flex">
          <Text className="mr-4" size="sm">
            Placehodler <br />
            for Image
          </Text>
          <Text className="mr-2" size="xl">
            {pmanu}
          </Text>
          <Text size="xl">{pnum}</Text>
        </div>
        <AddPartHistoryModal pnum={pnum} pmanu={pmanu} />
      </div>
      <div className="p-3">
        <PlotPartHistory plotProps={props} />
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
