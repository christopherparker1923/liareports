// pages/index.tsx

import {
  Autocomplete,
  Button,
  NumberInput,
  TextInput,
  Text,
  Modal,
  Group,
  Accordion,
} from "@mantine/core";
import type { GetServerSideProps } from "next";
import { ReactElement, useState } from "react";
import { AppButton } from "../../../components/AppButton";
import { Layout } from "../../../components/Layout";
import { ProjectForm } from "../../../components/ProjectForm";
import { getBasicServerSideProps } from "../../../services/getBasicSeverSideProps";
import { api } from "../../../utils/api";
import type { NextPageWithLayout } from "../../_app";

const Projects: NextPageWithLayout = () => {
  const allProjects = api.projects.getAllProjects.useQuery();

  console.log(allProjects);
  const [opened, setOpened] = useState(false);
  function toggleOpened() {
    setOpened(!opened);
  }
  return (
    <>
      <AppButton label="New Project" onClick={toggleOpened} />
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        title="New Project"
      >
        <ProjectForm />
      </Modal>
      <Accordion defaultValue="customization">
        {allProjects.data?.map((project) => {
          return (
            <Accordion.Item value={project.id.toString()}>
              <Accordion.Control>{project.projectNumber}</Accordion.Control>
              <Accordion.Panel>
                <Text>Lead: {project.projectLead ?? ""}</Text>
                <Text>{project.description}</Text>
                <AppButton label="Placeholder for Detail View" />
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </>
  );
};

Projects.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Projects;
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
