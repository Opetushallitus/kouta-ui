import produce from 'immer';
import get from 'lodash/get';
import set from 'lodash/set';

import { isArray } from '../../utils';

export const getNumberOfColumns = rows => {
  return isArray(rows)
    ? Math.max(...rows.map(row => (get(row, 'columns') || []).length))
    : 0;
};

export const getEmptyColumn = () => ({ text: '' });

export const getEmptyRow = numColumns => {
  return {
    columns: [...new Array(numColumns)].map(getEmptyColumn),
  };
};

export const addColumnToIndex = ({ value, columnIndex }) => {
  return produce(value, draft => {
    const rows = get(draft, 'rows') || [];

    rows.forEach(row => {
      const columns = get(row, 'columns') || [];
      const columnsBefore =
        columnIndex < 0 ? [] : columns.slice(0, columnIndex + 1);

      const columnsAfter =
        columnIndex >= columns.length - 1
          ? []
          : columns.slice(columnIndex + 1, columns.length);

      row.columns = [...columnsBefore, getEmptyColumn(), ...columnsAfter];
    });
  });
};

export const removeColumn = ({ value, columnIndex }) => {
  return produce(value, draft => {
    const rows = get(draft, 'rows') || [];

    rows.forEach(row => {
      const columns = get(row, 'columns') || [];

      columns.splice(columnIndex, 1);

      row.columns = columns;
    });
  });
};

export const addRowToIndex = ({ value, rowIndex }) => {
  return produce(value, draft => {
    const rows = get(draft, 'rows') || [];

    const rowsBefore = rowIndex < 0 ? [] : rows.slice(0, rowIndex + 1);

    const rowsAfter =
      rowIndex >= rows.length - 1 ? [] : rows.slice(rowIndex + 1, rows.length);

    draft.rows = [
      ...rowsBefore,
      getEmptyRow(getNumberOfColumns(rows)),
      ...rowsAfter,
    ];
  });
};

export const removeRow = ({ value, rowIndex }) => {
  return produce(value, draft => {
    const rows = get(draft, 'rows') || [];

    rows.splice(rowIndex, 1);

    draft.rows = rows;
  });
};

export const setRowHeaderStatus = ({ value, rowIndex, status }) => {
  return produce(value, draft => {
    set(draft, ['rows', rowIndex, 'isHeader'], status);
  });
};

export const setColumnFieldValue = ({
  value,
  rowIndex,
  columnIndex,
  field,
  fieldValue,
  language,
}) => {
  let path = ['rows', rowIndex, 'columns', columnIndex, field];

  if (language) {
    path = [...path, language];
  }

  return produce(value, draft => {
    set(draft, path, fieldValue);
  });
};
