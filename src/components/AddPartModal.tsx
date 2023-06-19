import {
  Modal,
  Autocomplete,
  TextInput,
  Group,
  HoverCard,
  NumberInput,
  Checkbox,
  Textarea,
  MultiSelect,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { PartTypes, PartTags } from "@prisma/client";
import { api } from "../utils/api";
import { AppButton } from "./AppButton";
import { partSchema } from "./ZodSchemas";
import { IconCheck, IconX } from "@tabler/icons-react";

export function AddPartModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data: validManufacturerNames } =
    api.manufacturers?.getAllManufacturerNames.useQuery();

  const form = useForm({
    validate: zodResolver(partSchema),
    initialValues: {
      partNumber: "",
      partType: "" as PartTypes,
      length: undefined,
      width: undefined,
      height: undefined,
      CSACert: false,
      ULCert: false,
      preference: 5,
      description: "",
      partTags: [] as PartTags[],
      image: "",
      manufacturerName: "",
    },
  });

  const { mutate: createPart, isLoading: createPartIsLoading } =
    api.parts.createPart.useMutation({
      onError: (createPartError) => {
        console.log("returned error: ", createPartError);
        //notifications.clean();
        console.log("error");
        notifications.show({
          title: "Error Creating Part",
          message: `${createPartError?.message || "error message unavailable"}`,
          icon: <IconX />,
          color: "red",
          autoClose: 4000,
        });
      },
      onSuccess: (createPartData) => {
        close();
        console.log("returned data: ", createPartData);
        //notifications.clean();
        notifications.show({
          title: "Success",
          message: `${createPartData?.partNumber || "partNumber unavailable"}`,
          icon: <IconCheck />,
          color: "green",
          autoClose: 4000,
        });
      },
    });
  if (createPartIsLoading) {
    notifications.show({
      title: "Loading",
      message: "",
      loading: true,
      autoClose: false,
    });
  }
  return (
    <>
      <div>
        <Modal opened={opened} onClose={close} title="Add New Part" centered>
          <form
            onSubmit={form.onSubmit((values) => {
              createPart(values);
            })}
          >
            <Autocomplete
              withAsterisk
              label="Manufacturer"
              className="w-full"
              maxDropdownHeight={300}
              placeholder={"ALLEN BRADLEY"}
              limit={50}
              data={
                validManufacturerNames?.map((manufacturer) => {
                  return manufacturer.name;
                }) || []
              }
              {...form.getInputProps("manufacturerName")}
            />
            <TextInput
              withAsterisk
              label="Manufacturer Part Number"
              placeholder="1756-AENTR"
              mt="sm"
              {...form.getInputProps("partNumber")}
            />
            <Autocomplete
              withAsterisk
              label="Part Type"
              className="my-1 w-full"
              maxDropdownHeight={300}
              placeholder={"Card"}
              limit={50}
              data={Object.keys(PartTypes)}
              {...form.getInputProps("partType")}
            />

            <Group position="center">
              <HoverCard
                withinPortal={true}
                position="right"
                width={280}
                shadow="md"
              >
                <HoverCard.Target>
                  <div className="flex items-center gap-2">
                    <NumberInput
                      placeholder="(mm)"
                      hideControls={true}
                      label="Height"
                      {...form.getInputProps("height")}
                    />
                    <NumberInput
                      placeholder="(mm)"
                      hideControls={true}
                      label="Width (Radius)"
                      {...form.getInputProps("width")}
                    />
                    <NumberInput
                      placeholder="(mm)"
                      hideControls={true}
                      label="Depth (Length)"
                      {...form.getInputProps("length")}
                    />
                  </div>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text size="md">
                    Enter dimensions in millimeters.
                    <br />
                    <br />
                    (Bracketed) values are for radial items such as cables - use
                    height zero for these.
                    <br />
                    <br />
                    Height and Width are for the face or cross section of an
                    object and depth is the remaining dimension.
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
            </Group>

            <div className="mt-2 flex items-center justify-between">
              <div>
                <Checkbox
                  label="CSA Certified"
                  color="gray"
                  {...form.getInputProps("CSACert")}
                />
                <Checkbox
                  className="mt-1"
                  label="UL Certified"
                  color="gray"
                  {...form.getInputProps("ULCert")}
                />
              </div>
              <Group position="center">
                <HoverCard
                  withinPortal={true}
                  position="right"
                  width={280}
                  shadow="md"
                >
                  <HoverCard.Target>
                    <NumberInput
                      withAsterisk
                      className="justify-end"
                      placeholder="10 is highest"
                      label="Preference (1-10)"
                      max={10}
                      min={1}
                      {...form.getInputProps("preference")}
                    />
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text size="md">
                      1 - least preferred
                      <br />
                      5 - neutral
                      <br />
                      10 - most preferred
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Group>
            </div>

            <Textarea
              className="my-1"
              label="Part Description"
              placeholder="Please be thorough and specific"
              mt="sm"
              {...form.getInputProps("description")}
            />

            <MultiSelect
              data={Object.keys(PartTags)}
              label="Part Tags"
              placeholder="Assign relevant tags"
              searchable
              nothingFound="Nothing found"
              clearable
              {...form.getInputProps("partTags")}
            />
            <div className="mt-2 flex items-center justify-around">
              <AppButton label={"Submit"} type="submit" />
              <AppButton
                label={"Clear"}
                onClick={() => form.reset()}
              ></AppButton>
            </div>
          </form>
        </Modal>

        <Group className="justify-start " position="center">
          <AppButton label="Add Part" onClick={open}></AppButton>
        </Group>
      </div>
    </>
  );
}
