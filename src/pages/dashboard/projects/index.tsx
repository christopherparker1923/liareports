// pages/index.tsx

import {
  Autocomplete,
  Button,
  NumberInput,
  TextInput,
  Text,
  Modal,
  Group,
} from "@mantine/core";
import type { GetServerSideProps } from "next";
import { ReactElement, useState } from "react";
import { AppButton } from "../../../components/AppButton";
import { Layout } from "../../../components/Layout";
import { ProjectForm } from "../../../components/ProjectForm";
import { getBasicServerSideProps } from "../../../services/getBasicSeverSideProps";
import type { NextPageWithLayout } from "../../_app";

const Projects: NextPageWithLayout = () => {
  const [opened, setOpened] = useState(false);
  function toggleOpened() {
    setOpened(!opened);
  }
  return (
    <>
      <Text>Placeholder for project drill down table</Text>
      <AppButton label="New Project" onClick={toggleOpened} />
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        title="Introduce yourself!"
      >
        <ProjectForm />
      </Modal>
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
