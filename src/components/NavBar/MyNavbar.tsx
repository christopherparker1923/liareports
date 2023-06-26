import { Navbar } from "@mantine/core";
import {
  IconAlignBoxBottomCenter,
  IconBuildingFactory2,
  IconBuildingStore,
  IconFileExport,
  IconFileImport,
  IconFileSettings,
  IconTriangleSquareCircle,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MainLink } from "../MainLink";
import { NavBarGenerateAccordion } from "./NavBarGenerateAccordion";
import { NavBarImportAccordion } from "./NavBarImportAccordion";
import { UserDetails } from "./UserDetails";
import { NavBarExportAccordion } from "./NavBarExportAccordion";

type NavBarProps = {
  opened: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
export function MyNavbar({ opened }: NavBarProps) {
  const { data: sessionData } = useSession();

  console.log("TopSession: ", sessionData);

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
    >
      <Navbar.Section>
        <Link href="/dashboard/projects">
          <MainLink
            color="red"
            icon={<IconAlignBoxBottomCenter />}
            label="Projects"
          />
        </Link>
        <Link href="/dashboard/parts">
          <MainLink
            color="orange"
            icon={<IconTriangleSquareCircle />}
            label="Parts"
          />
        </Link>
        <Link href="/dashboard/manufacturers">
          <MainLink
            color="yellow"
            icon={<IconBuildingFactory2 />}
            label="Manufacturers"
          />
        </Link>
        <Link href="/dashboard/vendors">
          <MainLink color="lime" icon={<IconBuildingStore />} label="Vendors" />
        </Link>
        <NavBarGenerateAccordion colour="green" icon={<IconFileSettings />} />
        <NavBarImportAccordion colour="blue" icon={<IconFileImport />} />
        <NavBarExportAccordion colour="violet" icon={<IconFileExport />} />
      </Navbar.Section>
      <Navbar.Section>
        {sessionData && <UserDetails session={sessionData} />}
      </Navbar.Section>
    </Navbar>
  );
}
