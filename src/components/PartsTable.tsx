import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { PaginationState } from "@tanstack/react-table";
import { api } from "../utils/api";
import Link from "next/link";
import { AddPartModal } from "./AddDataModals/AddPartModal";
import { useDebouncedValue } from "@mantine/hooks";
import { Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

export function PartsTable() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);

  console.log(debouncedSearch[0]);

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
  const fetchDataOptions = {
    pageSize,
    pageIndex,
    search: debouncedSearch[0],
  };

  const parts = api.parts.getQueriedPartsFull.useQuery(fetchDataOptions, {
    queryKey: ["parts.getQueriedPartsFull", fetchDataOptions],
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

  // const updateSearch = async () => {
  //   await parts.refetch();
  // };

  if (!parts.data) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-2">
      <div className="align-center mb-2 flex justify-center gap-2">
        <AddPartModal />
        <Input
          icon={<IconSearch />}
          className="mb-1 w-2/5 rounded border-zinc-500 text-gray-500  dark:text-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* <button onClick={() => updateSeach()}>update search</button> */}
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
                  {row.getVisibleCells().map((cell, i) => {
                    if (i === 0) {
                      return (
                        <td
                          key={cell.id}
                          className="border-b  border-zinc-500 px-4 py-2"
                        >
                          <Link
                            href={`parts/${row.original.manufacturerName}/${row.original.partNumber}`}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </Link>
                        </td>
                      );
                    }
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
    </div>
  );
}
