import { Accordion, Group, ThemeIcon, Text } from "@mantine/core";
import Link from "next/link";
import { MainLink } from "../MainLink";

export const NavBarGenerateAccordion = ({
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
            <Text size="sm">Generate</Text>
          </Group>
        </Accordion.Control>
        <Accordion.Panel className="ml-4">
          <Link href="/dashboard/generate/packing-slip">
            <MainLink color={colour} icon={icon} label="Packing Slip" />
          </Link>
        </Accordion.Panel>
        <Accordion.Panel className="ml-4">
          <Link href="/dashboard/generate/purchase-order" className="p-0">
            <MainLink color={colour} icon={icon} label="Purchase Order" />
          </Link>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
