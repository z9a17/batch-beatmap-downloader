import classNames from 'classnames';
import React from 'react';
import { RowProps, TableData, TableHeader } from '../../types/table';

interface PropTypes {
  headers: TableHeader[]
  data: TableData[]
  RenderRow?: React.FC<RowProps>
  className?: string
  onRowAction?: (action: string, row: TableData) => void
}

const DefaultTableRow: React.FC<RowProps> = ({ entry, headers }) => (
  <>
    {headers.map((header, index) => (
      <td
        key={header.key}
        className={classNames(
          { 'pl-6': index === 0 },
          'h-12 px-4 py-2 text-xs whitespace-pre-wrap text-[#a6aec2]',
        )}
      >
        {(entry as Record<string, React.ReactNode>)[header.key]}
      </td>
    ))}
  </>
);

const Table: React.FC<PropTypes> = ({ data, headers, RenderRow = DefaultTableRow, className, onRowAction }) => (
  <table className={classNames(className, 'w-full text-[#a6aec2]')}>
    <thead className="border-b border-[#222a42] bg-[#0b0f1b]">
      <tr>
        {headers.map((header, index) => (
          <th
            key={header.key}
            className={classNames(
              { 'pl-6': index === 0 },
              'px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#626b84]',
            )}
          >
            {header.title}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.length === 0 ? <tr><td colSpan={6} className="px-6 py-8 text-center text-xs text-[#626b84]">No results found</td></tr> : (
        data.map((entry, index) => (
          <tr key={index} className={classNames(
            { 'border-b-0': index === data.length - 1 },
            'border-b border-[#1d2438] transition hover:bg-white/[0.025]'
          )}>
            {<RenderRow entry={entry} headers={headers} onRowAction={onRowAction} />}
          </tr>
        ))
      )}
    </tbody>
  </table>
);

export default Table;
