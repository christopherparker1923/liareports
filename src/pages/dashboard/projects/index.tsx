// pages/index.tsx

import {
  Autocomplete,
  Button,
  NumberInput,
  TextInput,
  Text,
} from "@mantine/core";
import type { GetServerSideProps } from "next";
import { ReactElement } from "react";
import { Layout } from "../../../components/Layout";
import { getBasicServerSideProps } from "../../../services/getBasicSeverSideProps";
import type { NextPageWithLayout } from "../../_app";

const Projects: NextPageWithLayout = () => {
  return (
    <>
      <Text>Placeholder for project drill down table</Text>
      <Button
        sx={(theme) => ({
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[3],
          },
        })}
        //    onClick={() =>
        //   void generatePackingSlip(
        //     selectedParts,
        //     "Josh Stevens",
        //     "TMMC\n1150 Fountain Street\nCambridge, ON",
        //     "Same as Billing",
        //     "12/25/2022",
        //     "000125829",
        //     "PO5910",
        //     "Engineering",
        //     "Comment",
        //     "PAID & \nTESTED"
        //   )
        // }
      >
        Generate
      </Button>
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
