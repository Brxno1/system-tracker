import {
 useReactTable,
 getCoreRowModel,
 flexRender
} from '@tanstack/react-table'
import type { SureBet } from '@/types'
import { columns } from './columns'

interface BetsTableProps {
 data: SureBet[]
}

export function BetsTable({ data }: BetsTableProps) {
 const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel()
 })

 return (
  <div className="rounded-lg border border-border">
   <table className="w-full">
    <thead>
     {table.getHeaderGroups().map((headerGroup) => (
      <tr key={headerGroup.id} className="border-b border-border">
       {headerGroup.headers.map((header) => (
        <th
         key={header.id}
         className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
        >
         {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        </th>
       ))}
      </tr>
     ))}
    </thead>
    <tbody>
     {table.getRowModel().rows.length ? (
      table.getRowModel().rows.map((row) => (
       <tr
        key={row.id}
        className="border-b border-border transition-colors hover:bg-muted/50"
       >
        {row.getVisibleCells().map((cell) => (
         <td key={cell.id} className="px-4 py-3 text-sm">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
         </td>
        ))}
       </tr>
      ))
     ) : (
      <tr>
       <td
        colSpan={columns.length}
        className="px-4 py-8 text-center text-muted-foreground"
       >
        Nenhuma aposta registrada ainda.
       </td>
      </tr>
     )}
    </tbody>
   </table>
  </div>
 )
}
