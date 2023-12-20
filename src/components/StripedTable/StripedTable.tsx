import React from 'react';

import styles from './StripedTable.module.scss';
import { ColumnData } from 'utils/types';

interface StripedTableProps<T> {
  data: T[];
  columnData: ColumnData<T>;
  getRowKey: (row: T) => string | number;
}

function StripedTable<T>({ data, columnData, getRowKey }: StripedTableProps<T>) {
  return (
    <div className={styles.tableContainer}>
      <table>
        <colgroup>
          {columnData.map(({ colStyle, colClassName }, i) => (
            <col key={i} style={colStyle} className={colClassName} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columnData.map(({ label }, i) => (
              <th key={i}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={getRowKey(row)}>
              {columnData.map(({ render, className }, i) => (
                <td key={i} className={className}>
                  {render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StripedTable;
