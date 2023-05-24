import { Accordion, Group, ThemeIcon, Text } from "@mantine/core";
import {
  IconFileSettings,
  IconFileArrowRight,
  IconFileDollar,
  IconFileExport,
} from "@tabler/icons-react";
import Link from "next/link";
import { MainLink } from "../MainLink";
import { appRouter } from "../../server/api/root";
import ExportParts from "../../utils/exportParts";
import { api } from "../../utils/api";

export const NavBarExportAccordion = ({
  colour,
  icon,
}: {
  colour: string;
  icon: React.ReactNode;
}) => {
  const { data, refetch } = api.parts.getAllParts.useQuery(undefined, {
    refetchOnWindowFocus: false,
    enabled: false,
  });
  const fetchParts = async () => {
    await refetch();
    if (!data) return;
    ExportParts(data);
  };
  return (
    <Accordion
      styles={() => ({
        content: {
          padding: 0,
        },
      })}
    >
      <Accordion.Item value="packingSlip">
        <Accordion.Control style={{ padding: "10px" }}>
          <Group>
            <ThemeIcon color={colour} variant="light">
              {icon}
            </ThemeIcon>
            <Text size="sm">Export</Text>
          </Group>
        </Accordion.Control>
        <Accordion.Panel className="ml-4">
          <Link href="/dashboard/generate/packing-slip">
            <MainLink
              color={colour}
              icon={icon}
              label="Projects - Placeholder"
            />
          </Link>
        </Accordion.Panel>
        <Accordion.Panel className="ml-4">
          <MainLink
            color={colour}
            icon={icon}
            label="Parts"
            onClick={fetchParts}
          />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
