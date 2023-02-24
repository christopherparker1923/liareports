/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import ReactDOM from "react-dom/client";

import {
  Column,
  Table,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
  ExpandedState,
  getExpandedRowModel,
  Cell,
} from "@tanstack/react-table";
import { api } from "../utils/api";
import { ProjectChildWithChildren } from "../server/api/routers/projects";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<ProjectChildWithChildren>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    );
  },
};

function useSkipper() {
  const shouldSkipRef = React.useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = React.useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  React.useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}

export function TestProjectTable({ pid }: { pid: string }) {
  const rerender = React.useReducer(() => ({}), {})[1];
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const handleUpdate = (
    rowIndex: number,
    columnId: string,
    value: unknown,
    cell: Cell<ProjectChildWithChildren, any>
  ) => {
    console.log(
      "🚀 ~ file: ProjectTable.tsx:74 ~ handleUpdate ~ cellId:",
      cell
    );
    // Skip age index reset until after next rerender
    skipAutoResetPageIndex();
    setData((old) =>
      old?.map((row, index) => {
        if (index === rowIndex) {
          const oldCol = old[rowIndex]!;
          const weWannaGo = cell.row.id.split(".");
          let children = oldCol.children;
          weWannaGo.forEach((depth, i) => {
            if (i === weWannaGo.length - 1) {
              const item = children[weWannaGo[i - 1]].projectParts[depth];

              item.manufacturerPart.partNumber = value;
              return { ...oldCol };
            }
            if (children?.children) {
              children = children.children[depth];
            }
          });
        }
        return row;
      })
    );
  };
  const cols = React.useMemo<ColumnDef<ProjectChildWithChildren>[]>(
    () => [
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
            cell: ({ row, getValue, column, cell }) => (
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
                  <input
                    value={getValue() as string}
                    onChange={(e) => {
                      handleUpdate(row.index, column.id, e.target.value, cell);
                    }}
                  ></input>
                </>
              </div>
            ),
            footer: (props) => props.column.id,
            id: "name",
            accessorFn: (row) => row.name,
          },
        ],
      },
    ],
    []
  );

  const columns = React.useMemo<ColumnDef<ProjectChildWithChildren>[]>(
    () => [
      {
        header: "Name",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorFn: (row) => row.name,

            header: () => <span>Last Name</span>,
            footer: (props) => props.column.id,
          },
        ],
      },
    ],
    []
  );
  const { data: ProjectData } = api.projects.getProjectChildrenById.useQuery(
    pid,
    {
      initialData: [],
      onSuccess: () => {
        setData(ProjectData);
      },
    }
  );
  const [data, setData] = React.useState(() => ProjectData);
  console.log(data);
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data: data,
    columns: cols,
    state: { expanded },
    onExpandedChange: setExpanded,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    autoResetPageIndex,
    getSubRows: (row) => {
      if (row.children?.length) {
        const parts = row?.projectParts?.map((p) => ({
          name: p.manufacturerPart.partNumber,
        })) as ProjectChildWithChildren[];
        const newRow = [...row.children, ...parts];

        return newRow;
      } else if (row.projectParts?.length) {
        const newRow = row.projectParts?.map(
          (p) =>
            ({
              name: p.manufacturerPart.partNumber,
            } as ProjectChildWithChildren)
        );
        return newRow;
      }
    },
    // Provide our updateData function to our table meta
    meta: {
      updateData: handleUpdate,
    },
    // debugTable: true,
  });
  if (!ProjectData) return <div>Loading...</div>;
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
