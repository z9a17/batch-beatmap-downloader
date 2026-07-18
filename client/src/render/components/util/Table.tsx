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
          'h-12 px-4 py-2 text-xs whitespace-pre-wrap text-[#bbc4d2]',
        )}
      >
        {(entry as Record<string, React.ReactNode>)[header.key]}
      </td>
    ))}
  </>
);

const Table: React.FC<PropTypes> = ({ data, headers, RenderRow = DefaultTableRow, className, onRowAction }) => (
  <table className={classNames(className, 'w-full text-[#bbc4d2]')}>
    <thead className="border-b border-[#334055] bg-[#171f2a]">
      <tr>
        {headers.map((header, index) => (
          <th
            key={header.key}
            className={classNames(
              { 'pl-6': index === 0 },
              'px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.1em] text-[#a4b0c2]',
            )}
          >
            {header.title}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.length === 0 ? <tr><td colSpan={6} className="px-6 py-8 text-center text-[13px] text-[#a4b0c2]">No results found</td></tr> : (
        data.map((entry, index) => (
          <tr key={index} className={classNames(
            { 'border-b-0': index === data.length - 1 },
            'border-b border-[#2a3546] transition hover:bg-white/[0.025]'
          )}>
            {<RenderRow entry={entry} headers={headers} onRowAction={onRowAction} />}
          </tr>
        ))
      )}
    </tbody>
  </table>
);

export default Table;
