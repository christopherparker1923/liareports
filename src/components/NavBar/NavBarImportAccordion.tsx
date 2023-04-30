import { Accordion, Group, ThemeIcon, Text } from "@mantine/core";
import {
  IconFileSettings,
  IconFileArrowRight,
  IconFileDollar,
  IconFileImport,
} from "@tabler/icons-react";
import Link from "next/link";
import { MainLink } from "../MainLink";

export const NavBarImportAccordion = ({
  colour,
  icon,
}: {
  colour: string;
  icon: React.ReactNode;
}) => {
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
            <Text size="sm">Import</Text>
          </Group>
        </Accordion.Control>
        <Accordion.Panel className="ml-4">
          <Link href="/dashboard/generate/packing-slip">
            <MainLink color={colour} icon={icon} label="Parts - Placehodler" />
          </Link>
        </Accordion.Panel>
        <Accordion.Panel className="ml-4">
          <Link href="/dashboard/generate/purchase-order" className="p-0">
            <MainLink
              color={colour}
              icon={icon}
              label="Part History - Placeholder"
            />
          </Link>
        </Accordion.Panel>
        <Accordion.Panel className="ml-4">
          <Link href="/dashboard/generate/purchase-order" className="p-0">
            <MainLink
              color={colour}
              icon={icon}
              label="Manufacturers - Placeholder"
            />
          </Link>
        </Accordion.Panel>
        <Accordion.Panel className="ml-4">
          <Link href="/dashboard/generate/purchase-order" className="p-0">
            <MainLink
              color={colour}
              icon={icon}
              label="Vendors - Placeholder"
            />
          </Link>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
