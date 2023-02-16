// pages/index.tsx

import { Text } from "@mantine/core";
import type { GetServerSideProps } from "next";
import type { ReactElement } from "react";
import { Layout } from "../../../components/Layout";
import { getBasicServerSideProps } from "../../../services/getBasicSeverSideProps";
import type { NextPageWithLayout } from "../../_app";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import { z } from "zod";

const ProjectDetailView: NextPageWithLayout = () => {
  const router = useRouter();
  const { pid } = router.query;

  const project = api.projects.getProjectById.useQuery(pid, {
    enabled: !!pid,
  });
  if (!project) return <div>Loading...</div>;
  return (
    <>
      <Text size="lg">{project.data?.projectLead}</Text>
    </>
  );
};

ProjectDetailView.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ProjectDetailView;
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
