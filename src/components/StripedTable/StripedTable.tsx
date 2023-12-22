import React from 'react';

import styles from './StripedTable.module.scss';
import { ColumnData } from 'utils/types';
import { Box, CircularProgress } from '@mui/material';

interface StripedTableProps<T> {
  data: T[];
  columnData: ColumnData<T>;
  getRowKey: (row: T) => string | number;
  isFetching?: boolean;
}

function StripedTable<T>({ data, columnData, getRowKey, isFetching }: StripedTableProps<T>) {
  return isFetching ? (
    <Box className={styles.progressContainer}>
      <CircularProgress />
    </Box>
  ) : (
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

      {data.length === 0 && (
        <div className={styles.emptyTableTextContainer}>
          <h3>Nothing to see here</h3>
        </div>
      )}
    </div>
  );
}

export default StripedTable;
