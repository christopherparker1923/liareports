// pages/index.tsx

import { Text, Modal, Accordion } from "@mantine/core";
import type { GetServerSideProps } from "next";
import type { ReactElement } from "react";
import { useState } from "react";
import { AppButton } from "../../../components/AppButton";
import { Layout } from "../../../components/Layout";
import { PartsTable } from "../../../components/PartsTable";
import { ProjectForm } from "../../../components/ProjectForm";
import { getBasicServerSideProps } from "../../../services/getBasicSeverSideProps";
import { api } from "../../../utils/api";
import type { NextPageWithLayout } from "../../_app";

const Parts: NextPageWithLayout = () => {
  return (
    <>
      <AppButton label="Placeholder for Detail View" />
      <PartsTable />
    </>
  );
};

Parts.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Parts;
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
