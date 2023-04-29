import { Accordion, Group, ThemeIcon, Text } from "@mantine/core";
import {
  IconFileSettings,
  IconFileArrowRight,
  IconFileDollar,
} from "@tabler/icons-react";
import Link from "next/link";
import { MainLink } from "../MainLink";

export const NavBarGenerateAccordion = () => {
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
            <ThemeIcon color="red" variant="light">
              <IconFileSettings />
            </ThemeIcon>
            <Text size="sm">Generate</Text>
          </Group>
        </Accordion.Control>
        <Accordion.Panel className="ml-4">
          <Link href="/dashboard/generate/packing-slip">
            <MainLink
              color="red"
              icon={<IconFileArrowRight />}
              label="Packing Slip"
            />
          </Link>
        </Accordion.Panel>
        <Accordion.Panel className="ml-4">
          <Link href="/dashboard/generate/purchase-order" className="p-0">
            <MainLink
              color="red"
              icon={<IconFileDollar />}
              label="Purchase Order"
            />
          </Link>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
