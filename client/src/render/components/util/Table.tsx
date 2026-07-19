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
          'h-12 px-4 py-2 text-xs whitespace-pre-wrap text-mute',
        )}
      >
        {(entry as Record<string, React.ReactNode>)[header.key]}
      </td>
    ))}
  </>
);

const Table: React.FC<PropTypes> = ({ data, headers, RenderRow = DefaultTableRow, className, onRowAction }) => (
  <table className={classNames(className, 'w-full text-mute')}>
    <thead className="border-b border-line bg-sink">
      <tr>
        {headers.map((header, index) => (
          <th
            key={header.key}
            className={classNames(
              { 'pl-6': index === 0 },
              'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-faint',
            )}
          >
            {header.title}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.length === 0 ? <tr><td colSpan={6} className="px-6 py-8 text-center text-[13px] text-faint">No results found</td></tr> : (
        data.map((entry, index) => (
          <tr key={index} className={classNames(
            { 'border-b-0': index === data.length - 1 },
            'border-b border-line transition hover:bg-white/[0.02]'
          )}>
            {<RenderRow entry={entry} headers={headers} onRowAction={onRowAction} />}
          </tr>
        ))
      )}
    </tbody>
  </table>
);

export default Table;
