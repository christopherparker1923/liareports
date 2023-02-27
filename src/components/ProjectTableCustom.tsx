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
import { ProjectChildWithChildren } from "../server/api/routers/projects";
import { Accordion, Autocomplete } from "@mantine/core";

export function ProjectTableCustom({ pid }: { pid: string }) {
  const rerender = React.useReducer(() => ({}), {})[1];

  const project = api.projects.getProjectChildrenById.useQuery(pid);

  console.log("project");
  console.log(project);

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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true,
  });

  return (
    <>
      <Accordion>
        <Accordion.Item label={pid}>test</Accordion.Item>
      </Accordion>
    </>
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
