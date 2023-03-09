/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useMemo } from "react";
import ReactDOM from "react-dom/client";

import {
  PaginationState,
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { api } from "../utils/api";
import { ManufacturerPart, PartTags, PartTypes } from "@prisma/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Modal, Group, Button, Textarea, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AppButton } from "./AppButton";
import { useForm, zodResolver } from "@mantine/form";
import { projectSchema } from "./ProjectForm";
import { z } from "zod";

type Test = { partNumber: string };

export const partSchema = z.object({
  partNumber: z.string({ required_error: "Required" }),
  partType: z.nativeEnum(PartTypes, { required_error: "Required" }),
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  CSACert: z.boolean({ required_error: "Required" }),
  ULCert: z.boolean({ required_error: "Required" }),
  preference: z.number({ required_error: "Required" }).int().min(1).max(10),
  desciption: z.string({ required_error: "Required" }),
  partTags: z.nativeEnum(PartTags, { required_error: "Required" }).array(),
  image: z.string({ required_error: "Required" }),
  manufacturerName: z.string({ required_error: "Required" }),
});

export function PartsTable() {
  const rerender = React.useReducer(() => ({}), {})[1];
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    validate: zodResolver(partSchema),
    initialValues: {
      projectNumber: "",
      name: "",
      description: "",
      revision: "R0",
      status: "",
      projectLead: "",
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
        id: "CSACert",
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
          <TextInput
            withAsterisk
            label="Project Name"
            placeholder="22130 - BOM"
            mt="sm"
            {...form.getInputProps("name")}
          />
          <Textarea
            withAsterisk
            label="Project Description"
            placeholder=""
            mt="sm"
            {...form.getInputProps("description")}
          />
        </Modal>

        <Group className="my-3 justify-start " position="center">
          <AppButton label="Add Part" onClick={open}></AppButton>
        </Group>
      </div>
    </div>
  );
}
