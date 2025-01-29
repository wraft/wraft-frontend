import type { ExpandedState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { x } from "@xstyled/emotion";
import { useState } from "react";

import { Skeleton } from "../Skeleton";

import { EmptyImage } from "./EmptyImage";
import * as S from "./styled";

interface TableProps {
  data: any;
  columns: any;
  isLoading?: any;
  skeletonRows?: number;
  emptyMessage?: string;
  "aria-label"?: string;
}

const Table = ({
  data,
  columns,
  "aria-label": ariaLabel,
  isLoading = false,
  skeletonRows = 5,
  emptyMessage = "No Data",
}: TableProps) => {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const { getHeaderGroups, getRowModel, getState, options } = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row: any) => row.children,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true,
  });

  return (
    <>
      <S.Table aria-label={ariaLabel}>
        <S.Thead>
          {getHeaderGroups().map((headerGroup: any) => (
            <x.tr key={headerGroup.id} px="24px" py="12px" textAlign="left">
              {headerGroup.headers.map((header: any) => (
                <x.th
                  key={header.id}
                  py="md"
                  px="md"
                  borderBottom="1px solid"
                  borderColor="border"
                  fontWeight="heading"
                  fontSize="base"
                  color="text-secondary"
                  minWidth={header.getSize()}
                >
                  {header.isPlaceholder ? null : (
                    <x.div
                      cursor={
                        header.column.getCanSort() ? "pointer" : "default"
                      }
                      // sx={{
                      //   cursor: header.column.getCanSort()
                      //     ? 'pointer'
                      //     : 'default',
                      //   '&:hover': {
                      //     color: header.column.getCanSort()
                      //       ? 'primary'
                      //       : 'inherit',
                      //   },
                      // }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <x.span
                        transform={
                          header.column.getIsResizing()
                            ? `translateX(${
                                (options.columnResizeDirection === "rtl"
                                  ? -1
                                  : 1) *
                                (getState().columnSizingInfo.deltaOffset ?? 0)
                              }px)`
                            : ""
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </x.span>
                      {header.column.getCanSort() && (
                        <x.span>
                          {header.column.getIsSorted() === "asc" && " 🔼"}
                          {header.column.getIsSorted() === "desc" && " 🔽"}
                          {header.column.getIsSorted() !== "asc" &&
                            header.column.getIsSorted() !== "desc" &&
                            " ⬍"}
                        </x.span>
                      )}
                    </x.div>
                  )}
                </x.th>
              ))}
            </x.tr>
          ))}
        </S.Thead>
        <S.Tbody>
          {isLoading &&
            Array.from({ length: skeletonRows }, (_, index) => (
              <x.tr key={index}>
                {columns.map((column, columnIndex) => (
                  <x.td
                    py="14px"
                    px="24px"
                    borderBottom="1px solid"
                    borderColor="border"
                    key={`${columnIndex}-${index}`}
                  >
                    <Skeleton height="22px" />
                  </x.td>
                ))}
              </x.tr>
            ))}

          {!isLoading &&
            getRowModel().rows.map((row) => {
              return (
                <x.tr key={row.id} bg={row?.parentId && "background-secondary"}>
                  {row.getVisibleCells().map((cell) => (
                    <x.td
                      key={cell.id}
                      py="md"
                      px="md"
                      borderBottom="1px solid"
                      borderColor="border"
                      minWidth={`${cell.column.getSize()}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </x.td>
                  ))}
                </x.tr>
              );
            })}
        </S.Tbody>
      </S.Table>
      {!isLoading && data && data.length === 0 && (
        <x.div
          backgroundColor="background-primary"
          minHeight="300px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="1px solid"
          borderColor="border"
          borderTop="none"
        >
          <x.div textAlign="center">
            <EmptyImage />
            <x.p m="0">{emptyMessage}</x.p>
          </x.div>
        </x.div>
      )}
    </>
  );
};

export default Table;
