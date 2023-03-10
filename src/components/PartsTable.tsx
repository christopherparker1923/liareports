/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useMemo } from "react";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { PaginationState } from "@tanstack/react-table";
import { api } from "../utils/api";
import { PartTags, PartTypes } from "@prisma/client";
import {
  Modal,
  Group,
  Text,
  Textarea,
  TextInput,
  Autocomplete,
  NumberInput,
  HoverCard,
  Checkbox,
  MultiSelect,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AppButton } from "./AppButton";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

export const partSchema = z.object({
  partNumber: z.string({ required_error: "Required" }),
  partType: z.string({ required_error: "Required" }),
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  CSACert: z.boolean({ required_error: "Required" }),
  ULCert: z.boolean({ required_error: "Required" }),
  preference: z.number({ required_error: "Required" }).int().min(1).max(10),
  description: z.string().optional(),
  partTags: z.nativeEnum(PartTags, { required_error: "Required" }).array(),
  image: z.string().optional(),
  manufacturerName: z.string({ required_error: "Required" }),
});

export function PartsTable() {
  //const rerender = React.useReducer(() => ({}), {})[1];
  const [opened, { open, close }] = useDisclosure(false);
  const { data: validManufacturerNames } =
    api.manufacturers?.getAllManufacturerNames.useQuery();

  const form = useForm({
    validate: zodResolver(partSchema),
    initialValues: {
      partNumber: "",
      partType: "",
      length: undefined,
      width: undefined,
      height: undefined,
      CSACert: false,
      ULCert: false,
      preference: 1,
      description: "",
      partTags: [] as PartTags[],
      image: "",
      manufacturerName: "",
    },
  });

  const { mutate: createPart } = api.parts.createPart.useMutation({
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      console.log("success");
      close();
      // void queryClient.parts.getAllPartsFull.refetch();
    },
  });

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
  const fetchDataOptions = {
    pageSize,
    pageIndex,
  };

  const parts = api.parts.getAllPartsFull.useQuery(fetchDataOptions, {
    queryKey: ["parts.getAllPartsFull", fetchDataOptions],
    keepPreviousData: true,
  });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );
  //TODO: do this on the server
  const fixedParts = useMemo(() => {
    if (parts.data) {
      return parts.data.parts.map((part) => {
        return {
          ...part,
          partTags: part.partTags.map((tag) => tag.name).join(", "),
        };
      });
    }
  }, [parts.data]);

  const table = useReactTable({
    data: fixedParts ?? [],
    columns: [
      {
        accessorFn: (part) => part.partNumber,
        id: "PartName",
        header: () => <span>Part Number</span>,
      },
      {
        accessorFn: (part) => part.manufacturerName,
        id: "Manufacturer",
        header: () => <span>Manufacturer</span>,
      },
      {
        accessorFn: (part) => part.partType,
        id: "PartType",
        header: () => <span>Part Type</span>,
      },
      // {
      //   header: "Dimensions",

      //   columns: [
      //     {
      //       accessorFn: (part) => part.length,
      //       id: "Length",
      //       header: () => <span>Length</span>,
      //     },
      //     {
      //       accessorFn: (part) => part.width,
      //       id: "Width",
      //       header: () => <span>Width</span>,
      //     },
      //     {
      //       accessorFn: (part) => part.height,
      //       id: "Height",
      //       header: () => <span>Height</span>,
      //     },
      //   ],
      //   id: "Dimensions",
      // },
      {
        accessorFn: (part) => part.length,
        id: "Length",
        header: () => <span>Depth (Length)</span>,
      },
      {
        accessorFn: (part) => part.width,
        id: "Width",
        header: () => <span>Width (Radius)</span>,
      },
      {
        accessorFn: (part) => part.height,
        id: "Height",
        header: () => <span>Height</span>,
      },
      {
        accessorFn: (part) => part.CSACert,
        id: "CSACert",
        header: () => <span>CSA Cert</span>,
      },
      {
        accessorFn: (part) => part.ULCert,
        id: "ULCert",
        header: () => <span>UL Cert</span>,
      },
      {
        accessorFn: (part) => part.description,
        id: "NOMCert",
        header: () => <span>Description</span>,
      },
      {
        accessorFn: (part) => {
          return part.partTags;
        },
        id: "PartTags",
        header: () => <span>Part Tags</span>,
      },
    ],
    pageCount: parts.data?.pageMax,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    // getPaginationRowModel: getPaginationRowModel(), // If only doing manual pagination, you don't need this
    debugTable: true,
  });
  if (!parts.data) {
    return <div>Loading...</div>;
  }
  console.log(form.values);
  return (
    <div className="p-2">
      <div className="h-2" />
      <div className="overflow-auto rounded-lg border border-b-0 border-zinc-500">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-zinc-900 dark:text-gray-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="rounded">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="border-none px-6 py-3"
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="mx-4">
            {table.getRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.id}
                  className="  bg-white hover:bg-gray-50   dark:bg-zinc-800 dark:hover:bg-gray-600"
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className="border-b  border-zinc-500 px-4 py-2"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="rounded border p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="rounded border p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="rounded border p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>

        <button
          className="rounded border p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="w-16 rounded border p-1"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        {parts.isFetching ? "Loading..." : null}
      </div>
      <div>{table.getRowModel().rows.length} Rows</div>
      <div>
        <Modal opened={opened} onClose={close} title="Add New Part" centered>
          <form onSubmit={form.onSubmit((values) => createPart(values))}>
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
              <HoverCard position="right" width={280} shadow="md">
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
                <HoverCard position="right" width={280} shadow="md">
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

        <Group className="my-3 justify-start " position="center">
          <AppButton label="Add Part" onClick={open}></AppButton>
        </Group>
      </div>
    </div>
  );
}

// partNumber: "",
// partType: null,
// length: null,
// width: null,
// height: null,
// CSACert: false,
// ULCert: false,
// preference: 2,
// description: "",
// partTags: [],
// image: "",
// manufacturerName: "",
