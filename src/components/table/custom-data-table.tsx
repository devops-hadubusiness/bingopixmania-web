// packages
import * as React from "react";
import { ColumnDef, RowSelectionState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, OnChangeFn } from "@tanstack/react-table";
import { ChevronRight, ChevronLeft, Search, SearchX } from "lucide-react";

// components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

// types
type TableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  children?: Readonly<React.ReactNode>;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  loading?: boolean;
  className?: string;
  tableClassName?: string;
  hideFilterInput?: boolean;
};

export function CustomDataTable<T>({ data, columns, children, className, tableClassName, rowSelection = {}, onRowSelectionChange = () => {}, loading = false, hideFilterInput = false }: TableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange,
    globalFilterFn: (row, _, filterValue) => {
      return row.getVisibleCells().some((cell) => {
        const cellValue = cell.getValue();
        return String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
      });
    },
  });

  const rows = table.getRowModel().rows;
  const emptyRowsCount = rows.length < 10 ? 10 - rows.length : 0;

  return (
    <div className={`w-full ${className ?? ""}`}>
      <div className={`w-full flex smAndDown:flex-wrap items-center xs:justify-center smAndUp:${children ? "justify-between" : "justify-end"} gap-y-4`}>
        {/* <div className={`w-full flex flex-row items-center ${children ? "justify-between" : "justify-end"} ${hideFilterInput ? "hidden" : ""}`}> */}
        {children}
        {!hideFilterInput && (
          <div className="relative group smAndDown:w-full">
            <Input placeholder="Filtrar..." value={globalFilter} onChange={(event) => setGlobalFilter(event.target.value)} className="smAndDown:w-full placeholder:text-sm placeholder:text-muted-foreground pl-10" />
            <Search className="absolute top-[calc(50%_-_8px)] left-4 size-4 text-muted-foreground group-focus-within:text-primary" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <Table className={tableClassName}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead key={header.id} className={`text-start text-nowrap truncate text-foreground bg-gray-200 dark:bg-gray-900 ${index == 0 ? "rounded-tl-md" : index == headerGroup.headers.length - 1 ? "rounded-tr-md" : ""}`}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="rounded-md bg-background dark:bg-gray-700">
            {/* border-x border-b rounded-b-lg */}
            {loading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={`skeleton-${index}-${colIndex}`}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length ? (
              <>
                {rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="dark:border-gray-500">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-start">
                        {/* text-nowrap line-clamp-2 */}
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {Array.from({ length: emptyRowsCount }).map((_, index) => (
                  <TableRow key={`empty-${index}`} className="dark:border-gray-500">
                    {columns.map((column, colIndex) => (
                      <TableCell key={`empty-${index}-${colIndex}`} className="text-start">
                        &nbsp;
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24">
                  <div className="flex flex-col w-full text-foreground items-center justify-center text-center text-muted-foreground gap-y-2">
                    <SearchX className="size-5" />
                    Sem resultados.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {!rowSelection && (
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel && table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
          </div>
        )}
        <div className="flex gap-x-2">
          <Button variant="default" size="sm" className="flex gap-x-2" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="size-4" />
            <span className="xxsAndDown:hidden">Anterior</span>
          </Button>
          <Button variant="default" size="sm" className="flex gap-x-2" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <span className="xxsAndDown:hidden">Próxima</span>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
