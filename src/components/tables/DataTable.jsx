import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { EmptyState } from '../common/StateView';

export function DataTable({ columns, data, sort, onSort, rowKey = 'id', emptyTitle }) {
  if (!data.length) return <EmptyState title={emptyTitle || 'No records found'} />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className="px-5 py-3 font-semibold">
                {column.sortable ? (
                  <button type="button" className="inline-flex items-center gap-1 hover:text-slate-800" onClick={() => onSort(column.key)}>
                    {column.label}
                    {sort?.key !== column.key ? <ChevronsUpDown className="size-3.5" /> : sort.direction === 'asc' ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />}
                  </button>
                ) : column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row) => (
            <tr key={row[rowKey]} className="transition hover:bg-slate-50/80">
              {columns.map((column) => (
                <td key={column.key} className="whitespace-nowrap px-5 py-4 text-slate-600">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
