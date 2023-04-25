// pages/index.tsx

import { Text } from "@mantine/core";
import type { GetServerSideProps } from "next";
import type { ReactElement } from "react";
import { Layout } from "../../../components/Layout";
import { getBasicServerSideProps } from "../../../services/getBasicSeverSideProps";
import type { NextPageWithLayout } from "../../_app";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import { ProjectDetailTable } from "../../../components/ProjectTable/ProjectDetailTable";

const ProjectDetailView: NextPageWithLayout = () => {
  const router = useRouter();
  const { pid } = router.query as { pid: string };

  const project = api.projects.getProjectById.useQuery(pid, {
    enabled: !!pid,
  });
  if (!project) return <div>Loading...</div>;
  if (!pid) return <div>Invalid project id</div>;
  return (
    <>
      <div className="flex justify-between">
        <div className="g-x-1">
          <Text size="lg">{project.data?.projectNumber}</Text>
          <Text size="lg">{project.data?.projectLead}</Text>
        </div>
        <div className="flex gap-x-1">
          <Text className="w-20" size="lg">
            Required
          </Text>
          <Text className="w-20" size="lg">
            Ordered
          </Text>
          <Text className="w-20" size="lg">
            Received
          </Text>
          <Text className="w-20" size="lg">
            Committed
          </Text>
        </div>
      </div>
      <ProjectDetailTable pid={pid} />
      {/* <TestProjectTable pid={pid} /> */}
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
