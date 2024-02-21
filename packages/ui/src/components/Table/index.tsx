import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from '@tanstack/react-table';
import styled, { th, x } from '@xstyled/emotion';
import * as S from './styled'
import { Skeleton } from '../Skeleton';


interface TableProps {
  data: any;
  columns: any;
  isLoading?: any;
  skeletonRows?: number;
  'aria-label'?: string;
}

const Table = ({ data, columns, 'aria-label': ariaLabel, isLoading = false, skeletonRows = 5 }: TableProps) => {
  const { getHeaderGroups, getRowModel, getState, options } = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  console.log('options', options);

  return (
    <>
      <S.Table aria-label={ariaLabel}>
        <S.Thead>
          {getHeaderGroups().map((headerGroup: any) => (
            <x.tr
              key={headerGroup.id}
              px="24px"
              py='12px'
              textAlign='left'
              >
              {headerGroup.headers.map((header: any) => (
                <x.th
                  key={header.id}
                  py='12px'
                  px='24px'
                  borderBottom= '1px solid'
                  borderColor='border'
                  fontFamily='body'
                  fontWeight= 'heading'
                  fontSize='12px'
                  color= '#A5ABB2'
                  minWidth={ header.getSize()}>

                  {header.isPlaceholder ? null : (
                    <x.div
                      cursor={header.column.getCanSort()
                          ? 'pointer'
                          : 'default'}
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
                      onClick={header.column.getToggleSortingHandler()}>
                      <x.span
                        transform={ header.column.getIsResizing()
                              ? `translateX(${
                                  (options.columnResizeDirection === 'rtl'
                                    ? -1
                                    : 1) *
                                  (getState().columnSizingInfo.deltaOffset ?? 0)
                                }px)`
                              : ''}
                        
                        >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </x.span>
                      {header.column.getCanSort() && (
                        <x.span>
                          {header.column.getIsSorted() === 'asc' && ' 🔼'}
                          {header.column.getIsSorted() === 'desc' && ' 🔽'}
                          {header.column.getIsSorted() !== 'asc' &&
                            header.column.getIsSorted() !== 'desc' &&
                            ' ⬍'}
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
          {isLoading
            && Array.from({ length: skeletonRows }, (_, index) => (
              <x.tr key={index}>
                {columns.map((column, columnIndex) => (
                  <x.td
                    py="14px"
                    px='24px'
                    key={`${columnIndex}-${index}`}
                  >
                    <Skeleton height="24px" />
                  </x.td>
                ))}
              </x.tr>
            ))}
          {!isLoading && getRowModel().rows.map((row) => {
            return (
              <x.tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  
                  <x.td
                    key={cell.id}
                    py="14px"
                    px='24px'
                    borderBottom='1px solid'
                    borderColor='border'
                    minWidth={`${cell.column.getSize()}px`}
                   >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </x.td>
                ))}
              </x.tr>
            );
          })}
        </S.Tbody>
      </S.Table>
    </>
  );
};

export default Table;
