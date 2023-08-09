import { produce } from 'immer';
import _ from 'lodash';

export type TableColumn = {
  index?: number;
  text: Partial<Record<LanguageCode, string>>;
};

export type TableInputRows = Array<{
  index?: number;
  isHeader?: boolean;
  columns: Array<TableColumn>;
}>;

export type TableInputValue = {
  rows: TableInputRows;
};

export const getNumberOfColumns = (rows: TableInputRows) => {
  return _.isArray(rows)
    ? Math.max(...rows.map(row => (row?.columns || []).length))
    : 0;
};

export const getMaxColumnLength = (rows: Array<Array<string>>) => {
  return _.isArray(rows) ? Math.max(...rows.map(row => (row || []).length)) : 0;
};

export const getEmptyColumn = (language: LanguageCode) =>
  ({ text: { [language]: '' } }) as TableColumn;

export const getEmptyRow = (numColumns: number, language: LanguageCode) => {
  return {
    columns: [...new Array(numColumns)].map(() => getEmptyColumn(language)),
  };
};

export const setTable = ({
  value,
  language,
  table,
}: {
  value: TableInputValue;
  language: LanguageCode;
  table: Array<Array<string>>;
}) => {
  const addExtraRowsIfNeeded = (draft, language) => {
    const rows = draft?.rows || [];
    const numberOfColumns = getNumberOfColumns(rows);
    const extraRows = table.length - rows.length;
    if (extraRows > 0) {
      const newRows = [...new Array(extraRows)].map(() =>
        getEmptyRow(numberOfColumns, language)
      );
      draft.rows = [...rows, ...newRows];
    }
  };
  const addExtraColumnsIfNeeded = (draft, language) => {
    const numberOfTableColumns = getMaxColumnLength(table);
    const rows = draft?.rows || [];
    const numberOfRowColumns = getNumberOfColumns(rows);
    const extraColumns = numberOfTableColumns - numberOfRowColumns;
    if (extraColumns > 0) {
      draft.rows.forEach(row => {
        const columns = _.get(row, 'columns') || [];

        row.columns = [
          ...columns,
          ...[...new Array(extraColumns)].map(() => getEmptyColumn(language)),
        ];
      });
    }
  };

  return produce(value, draft => {
    addExtraRowsIfNeeded(draft, language);
    addExtraColumnsIfNeeded(draft, language);

    table.forEach((tableRow, tableRowIndex) => {
      const row = draft.rows[tableRowIndex];
      tableRow.forEach((cell, columnIndex) => {
        let path = ['columns', columnIndex, 'text'];
        if (language) {
          path = [...path, language];
        }
        _.set(row, path, cell);
      });
    });
  });
};

export const addColumnToIndex = ({
  value,
  columnIndex,
  language,
}: {
  value: TableInputValue;
  columnIndex: number;
  language: LanguageCode;
}) => {
  return produce(value, draft => {
    const rows = draft?.rows || [];

    rows.forEach(row => {
      const columns = _.get(row, 'columns') || [];
      const columnsBefore =
        columnIndex < 0 ? [] : columns.slice(0, columnIndex + 1);

      const columnsAfter =
        columnIndex >= columns.length - 1
          ? []
          : columns.slice(columnIndex + 1, columns.length);

      row.columns = [
        ...columnsBefore,
        getEmptyColumn(language),
        ...columnsAfter,
      ];
    });
  });
};

export const removeColumn = ({
  value,
  columnIndex,
}: {
  value: TableInputValue;
  columnIndex: number;
}) => {
  return produce(value, draft => {
    const rows = draft?.rows || [];

    rows.forEach(row => {
      const columns = _.get(row, 'columns') || [];

      columns.splice(columnIndex, 1);

      row.columns = columns;
    });
  });
};

export const addRowToIndex = ({
  value,
  rowIndex,
  language,
}: {
  value: TableInputValue;
  rowIndex: number;
  language: LanguageCode;
}) => {
  return produce(value, draft => {
    const rows = draft?.rows || [];

    const rowsBefore = rowIndex < 0 ? [] : rows.slice(0, rowIndex + 1);

    const rowsAfter =
      rowIndex >= rows.length - 1 ? [] : rows.slice(rowIndex + 1, rows.length);

    draft.rows = [
      ...rowsBefore,
      getEmptyRow(getNumberOfColumns(rows), language),
      ...rowsAfter,
    ];
  });
};

export const removeRow = ({
  value,
  rowIndex,
}: {
  value: TableInputValue;
  rowIndex: number;
}) => {
  return produce(value, draft => {
    const rows = draft?.rows || [];

    rows.splice(rowIndex, 1);

    draft.rows = rows;
  });
};

export const setRowHeaderStatus = ({
  value,
  rowIndex,
  status,
}: {
  value: TableInputValue;
  rowIndex: number;
  status: boolean;
}) => {
  return produce(value, draft => {
    _.set(draft, ['rows', rowIndex, 'isHeader'], status);
  });
};

export const setColumnFieldValue = ({
  value,
  rowIndex,
  columnIndex,
  field,
  fieldValue,
  language,
}: {
  value: TableInputValue;
  rowIndex: number;
  columnIndex: number;
  field: string;
  fieldValue: string;
  language?: LanguageCode;
}) => {
  let path = ['rows', rowIndex, 'columns', columnIndex, field];

  if (language) {
    path = [...path, language];
  }

  return produce(value, draft => {
    _.set(draft, path, fieldValue);
  });
};
