// pages/index.tsx

import { Flex, Group, Select, Text } from "@mantine/core";
import type { GetServerSideProps } from "next";
import { useState, type ReactElement } from "react";
import { Layout } from "../../../components/Layout";
import { getBasicServerSideProps } from "../../../services/getBasicSeverSideProps";
import type { NextPageWithLayout } from "../../_app";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import { ProjectDetailTable } from "../../../components/ProjectTable/ProjectDetailTable";
import { AppButton } from "../../../components/AppButton";
import { AddNewRevisionModal } from "../../../components/AddDataModals/AddNewRevisionModal";

const ProjectDetailView: NextPageWithLayout = () => {
  const router = useRouter();
  const { pid } = router.query as { pid: string };
  const [sortBy, setSortBy] = useState("latest");
  const [totalCost, setTotalCost] = useState(0);

  const project = api.projects.getProjectById.useQuery(pid, {
    enabled: !!pid,
  });

  const handleNewTotalCost = (cost: number) => {
    setTotalCost(cost);
  };

  if (!project) return <div>Loading...</div>;
  if (!pid) return <div>Invalid project id</div>;
  console.log("sortBy: ", sortBy);
  return (
    <>
      <Flex
        className="mb-4 w-full justify-around"
        wrap="wrap"
        gap="xl"
        justify="center"
        direction="row"
        align="baseline"
      >
        <div>
          <Text size="lg">{`Project: ${
            project.data?.projectNumber || ""
          }`}</Text>
          <Text size="lg">{`Project Lead: ${
            project.data?.projectLead || ""
          }`}</Text>
        </div>
        <Select
          className="w-32"
          placeholder="Sort by"
          label="Sort Quotes"
          data={[
            { value: "price", label: "Price" },
            { value: "lead", label: "Lead time" },
            { value: "stock", label: "Stock" },
            { value: "latest", label: "Latest" },
          ]}
          defaultValue={"latest"}
          searchValue={sortBy}
          onSearchChange={(selected) => setSortBy(selected)} // needs to be modified to provide value instead of label
        />
        <Text size="lg">{`BOM Cost: $${totalCost || ""}`}</Text>
        <div>
          <Text size="lg">{`Revision: ${project.data?.revision || ""} - ${
            project.data?.status || ""
          }`}</Text>
          <Text size="lg">{`Revision Owner: ${
            project.data?.createdBy?.name || ""
          }`}</Text>
        </div>
        {project.data && (
          <AddNewRevisionModal
            id={project.data.id}
            projectNumber={project.data.projectNumber}
            name={project.data.name}
            description={project.data.description}
            projectLead={project.data.projectLead}
            revision={project.data.revision}
            status={project.data.status}
          ></AddNewRevisionModal>
        )}
      </Flex>
      <ProjectDetailTable
        pid={pid}
        sortBy={sortBy}
        totalCost={totalCost}
        updateTotalCost={handleNewTotalCost}
      />
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
