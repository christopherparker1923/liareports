// pages/index.tsx

import { Flex, Select, Text } from "@mantine/core";
import type { GetServerSideProps } from "next";
import { useState, type ReactElement } from "react";
import { Layout } from "../../../components/Layout";
import { getBasicServerSideProps } from "../../../services/getBasicSeverSideProps";
import type { NextPageWithLayout } from "../../_app";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import { ProjectDetailTable } from "../../../components/ProjectTable/ProjectDetailTable";
import { MenuDropdown } from "@mantine/core/lib/Menu/MenuDropdown/MenuDropdown";

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
        align="center"
      >
        <Text className="flex-" size="lg">{`Project: ${
          project.data?.projectNumber || ""
        }`}</Text>{" "}
        <Text size="lg">{`Project Lead: ${
          project.data?.projectLead || ""
        }`}</Text>
        <Select
          className="w-32"
          placeholder="Sort by"
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
