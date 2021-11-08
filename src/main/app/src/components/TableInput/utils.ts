import produce from 'immer';
import _ from 'lodash';

export const getNumberOfColumns = rows => {
  return _.isArray(rows)
    ? Math.max(...rows.map(row => (_.get(row, 'columns') || []).length))
    : 0;
};

export const getMaxColumnLength = rows => {
  return _.isArray(rows) ? Math.max(...rows.map(row => (row || []).length)) : 0;
};

export const getEmptyColumn = language => ({ text: { [language]: '' } });

export const getEmptyRow = (numColumns, language) => {
  return {
    columns: [...new Array(numColumns)].map(() => getEmptyColumn(language)),
  };
};

export const setTable = ({ value, language, table }) => {
  const addExtraRowsIfNeeded = (draft, language) => {
    const rows = _.get(draft, 'rows') || [];
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
    const rows = _.get(draft, 'rows') || [];
    const numberOfRowColumns = getNumberOfColumns(rows);
    const extraColumns = numberOfTableColumns - numberOfRowColumns;
    if (extraColumns > 0) {
      draft.rows.forEach((row, rowIndex) => {
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

export const addColumnToIndex = ({ value, columnIndex, language }) => {
  return produce(value, draft => {
    const rows = _.get(draft, 'rows') || [];

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

export const removeColumn = ({ value, columnIndex }) => {
  return produce(value, draft => {
    const rows = _.get(draft, 'rows') || [];

    rows.forEach(row => {
      const columns = _.get(row, 'columns') || [];

      columns.splice(columnIndex, 1);

      row.columns = columns;
    });
  });
};

export const addRowToIndex = ({ value, rowIndex, language }) => {
  return produce(value, draft => {
    const rows = _.get(draft, 'rows') || [];

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

export const removeRow = ({ value, rowIndex }) => {
  return produce(value, draft => {
    const rows = _.get(draft, 'rows') || [];

    rows.splice(rowIndex, 1);

    draft.rows = rows;
  });
};

export const setRowHeaderStatus = ({ value, rowIndex, status }) => {
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
}) => {
  let path = ['rows', rowIndex, 'columns', columnIndex, field];

  if (language) {
    path = [...path, language];
  }

  return produce(value, draft => {
    _.set(draft, path, fieldValue);
  });
};
