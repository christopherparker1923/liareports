// pages/index.tsx

import { Text, Modal, Accordion, Dialog, Flex } from "@mantine/core";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import type { ReactElement } from "react";
import { useState } from "react";
import { AppButton } from "../../../components/AppButton";
import { Layout } from "../../../components/Layout";
import { ProjectForm } from "../../../components/ProjectForm";
import { getBasicServerSideProps } from "../../../services/getBasicSeverSideProps";
import { api } from "../../../utils/api";
import type { NextPageWithLayout } from "../../_app";
import { useSession } from "next-auth/react";

const Projects: NextPageWithLayout = () => {
  const allProjects = api.projects.getAllProjects.useQuery();
  const deleteProjects = api.projects.deleteProject.useMutation({
    onSuccess: async () => {
      await allProjects.refetch();
    },
  });

  const { data: sessionData } = useSession();
  const [opened, setOpened] = useState(false);
  const [openedDialog, setOpenedDialog] = useState(false);
  const [projectForDelete, setProjectForDelete] = useState(0);
  function toggleOpened() {
    setOpened(!opened);
  }

  return (
    <>
      <div className="flex gap-2">
        <AppButton label="New Project" onClick={toggleOpened} />
        <AppButton label="Toggle Edit Mode" onClick={toggleOpened} />
      </div>
      <Dialog position={{ left: "50%", top: "25%" }} opened={openedDialog}>
        <Text>
          Confirm project deletion?
          <Flex>
            <AppButton
              label="Delete"
              onClick={() => {
                setOpenedDialog(false);
                deleteProjects.mutate(projectForDelete);
              }}
            />
            <AppButton
              label="Cancel"
              onClick={() => {
                setOpenedDialog(false);
              }}
            />
          </Flex>
        </Text>
      </Dialog>
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        title="New Project"
      >
        <ProjectForm setOpened={setOpened} />
      </Modal>
      <Accordion defaultValue="customization">
        {allProjects.data?.map((project) => {
          return (
            <Accordion.Item value={project.id.toString()} key={project.id}>
              <Accordion.Control>{project.projectNumber}</Accordion.Control>
              <Accordion.Panel>
                <Text>Lead: {project.projectLead ?? ""}</Text>
                <Text>{project.description}</Text>
                <Link href={"/dashboard/projects/" + project.projectNumber}>
                  <AppButton label="Detail View" />
                </Link>
                <AppButton
                  label="Delete"
                  onClick={() => {
                    setOpenedDialog(true);
                    setProjectForDelete(project.id);
                  }}
                />
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
