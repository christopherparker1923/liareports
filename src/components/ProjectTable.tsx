import React, { HTMLAttributes, HTMLProps } from "react";
import ReactDOM from "react-dom/client";

import {
  Column,
  Table,
  ExpandedState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

import { api } from "../utils/api";
import { ManufacturerPart } from "@prisma/client";

export function ProjectTable({ pid }: { pid: string }) {
  const rerender = React.useReducer(() => ({}), {})[1];

  // const columns = React.useMemo<ColumnDef<Person>[]>(
  //   () => [
  //     {
  //       header: "Name",
  //       footer: (props) => props.column.id,
  //       columns: [
  //         {
  //           accessorKey: "firstName",
  //           header: ({ table }) => (
  //             <>
  //               <IndeterminateCheckbox
  //                 {...{
  //                   checked: table.getIsAllRowsSelected(),
  //                   indeterminate: table.getIsSomeRowsSelected(),
  //                   onChange: table.getToggleAllRowsSelectedHandler(),
  //                 }}
  //               />{" "}
  //               <button
  //                 {...{
  //                   onClick: table.getToggleAllRowsExpandedHandler(),
  //                 }}
  //               >
  //                 {table.getIsAllRowsExpanded() ? "👇" : "👉"}
  //               </button>{" "}
  //               First Name
  //             </>
  //           ),
  //           cell: ({ row, getValue }) => (
  //             <div
  //               style={{
  //                 // Since rows are flattened by default,
  //                 // we can use the row.depth property
  //                 // and paddingLeft to visually indicate the depth
  //                 // of the row
  //                 paddingLeft: `${row.depth * 2}rem`,
  //               }}
  //             >
  //               <>
  //                 <IndeterminateCheckbox
  //                   {...{
  //                     checked: row.getIsSelected(),
  //                     indeterminate: row.getIsSomeSelected(),
  //                     onChange: row.getToggleSelectedHandler(),
  //                   }}
  //                 />{" "}
  //                 {row.getCanExpand() ? (
  //                   <button
  //                     {...{
  //                       onClick: row.getToggleExpandedHandler(),
  //                       style: { cursor: "pointer" },
  //                     }}
  //                   >
  //                     {row.getIsExpanded() ? "👇" : "👉"}
  //                   </button>
  //                 ) : (
  //                   "🔵"
  //                 )}{" "}
  //                 {getValue()}
  //               </>
  //             </div>
  //           ),
  //           footer: (props) => props.column.id,
  //         },
  //         {
  //           accessorFn: (row) => row.lastName,
  //           id: "lastName",
  //           cell: (info) => info.getValue(),
  //           header: () => <span>Last Name</span>,
  //           footer: (props) => props.column.id,
  //         },
  //       ],
  //     },
  //     {
  //       header: "Info",
  //       footer: (props) => props.column.id,
  //       columns: [
  //         {
  //           accessorKey: "age",
  //           header: () => "Age",
  //           footer: (props) => props.column.id,
  //         },
  //         {
  //           header: "More Info",
  //           columns: [
  //             {
  //               accessorKey: "visits",
  //               header: () => <span>Visits</span>,
  //               footer: (props) => props.column.id,
  //             },
  //             {
  //               accessorKey: "status",
  //               header: "Status",
  //               footer: (props) => props.column.id,
  //             },
  //             {
  //               accessorKey: "progress",
  //               header: "Profile Progress",
  //               footer: (props) => props.column.id,
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  //   []
  // );

  const project = api.projects.getProjectById.useQuery(1);
  console.log(
    "🚀 ~ file: ProjectTable.tsx:130 ~ ProjectTable ~ project",
    project
  );
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const table = useReactTable({
    data: project.data || [],
    columns: [
      {
        header: "Name",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: "name",
            header: ({ table }) => (
              <>
                <button
                  {...{
                    onClick: table.getToggleAllRowsExpandedHandler(),
                  }}
                >
                  {table.getIsAllRowsExpanded() ? "👇" : "👉"}
                </button>
                Parts
              </>
            ),
            cell: ({ row, getValue }) => (
              <div
                style={{
                  // Since rows are flattened by default,
                  // we can use the row.depth property
                  // and paddingLeft to visually indicate the depth
                  // of the row
                  paddingLeft: `${row.depth * 2}rem`,
                }}
              >
                <>
                  {row.getCanExpand() ? (
                    <button
                      {...{
                        onClick: row.getToggleExpandedHandler(),
                        style: { cursor: "pointer" },
                      }}
                    >
                      {row.getIsExpanded() ? "👇" : "👉"}
                    </button>
                  ) : (
                    "🔵"
                  )}
                  {getValue()}
                </>
              </div>
            ),
            footer: (props) => props.column.id,
          },
        ],
      },
    ],
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => {
      if (row.children?.length) {
        const newRow = [
          ...row.children,
          ...(row?.projectParts?.map((p) => ({
            name: p.manufacturerPart.partNumber,
          })) || []),
        ];

        return newRow;
      } else if (row.projectParts?.length) {
        return row.projectParts?.map((p) => ({
          name: `${p.manufacturerPart.partNumber} - ${p.manufacturerPart.manufacturerName}`,
        }));
      } else return row;
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true,
  });

  return (
    <div className="p-2">
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
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
      </div>
      <div>{table.getRowModel().rows.length} Rows</div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>

      <pre>{JSON.stringify(expanded, null, 2)}</pre>
    </div>
  );
}

function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="w-24 rounded border shadow"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className="w-24 rounded border shadow"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 rounded border shadow"
    />
  );
}

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}
