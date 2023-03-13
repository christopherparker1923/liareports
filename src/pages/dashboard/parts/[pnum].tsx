// pages/index.tsx

import { Text } from "@mantine/core";
import type { GetServerSideProps } from "next";
import type { ReactElement } from "react";
import { Layout } from "../../../components/Layout";
import { getBasicServerSideProps } from "../../../services/getBasicSeverSideProps";
import type { NextPageWithLayout } from "../../_app";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import { JacobTestTable } from "../../../components/JacobTestTable";

const PartDetailView: NextPageWithLayout = () => {
  const router = useRouter();
  const { pnum } = router.query as { pnum: string };

  //   const part = api.projects.getProjectById.useQuery(pid, {
  //     enabled: !!pid,
  //  });
  //if (!part) return <div>Loading...</div>;
  if (!pnum) return <div>Invalid project id</div>;
  return (
    <>
      <Text size="lg">{pnum}</Text>
      {/* <Text size="lg">{part.data?.projectNumber}</Text>
      <Text size="lg">{part.data?.projectLead}</Text> */}
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
