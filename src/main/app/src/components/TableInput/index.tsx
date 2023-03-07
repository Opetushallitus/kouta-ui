import React, { ClipboardEventHandler, Component, RefObject } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import {
  Box,
  Dropdown,
  DropdownMenu,
  DropdownMenuItem,
} from '#/src/components/virkailija';
import { getThemeProp, spacing } from '#/src/theme';

import {
  addColumnToIndex,
  removeColumn,
  addRowToIndex,
  getMaxColumnLength,
  setTable,
  getNumberOfColumns,
  removeRow,
  setRowHeaderStatus,
  setColumnFieldValue,
  TableInputValue,
} from './utils';

const ColumnInput = styled.textarea.attrs({ rows: 2 })`
  width: 100%;
  height: 100%;
  border: 0px none;
  outline: none;
  display: block;
  box-sizing: border-box;
  padding: ${spacing(1)};
  ${getThemeProp('typography.body')};
  transition: box-shadow 0.25s;
  box-shadow: 0 0 0 0;
  resize: none;
  background-color: transparent;

  &:focus {
    box-shadow: 0 0 0 2px ${getThemeProp('palette.primary.main')};
    position: relative;
    z-index: 1;
  }
`;

const Invisible = styled.div`
  visibility: hidden;
`;

const Column = styled(Box)`
  border-right: 1px solid ${getThemeProp('palette.border')};
  box-sizing: border-box;
  width: 17rem;
`;

const Row = styled(Box).attrs({ display: 'inline-flex' })<{
  isLast?: boolean;
  isHeader?: boolean;
}>`
  background-color: white;
  border-top: 1px solid ${getThemeProp('palette.border')};
  border-left: 1px solid ${getThemeProp('palette.border')};

  ${({ isLast }) =>
    isLast &&
    css`
      border-bottom: 1px solid ${getThemeProp('palette.border')};
    `}

  ${({ isHeader }) =>
    isHeader &&
    css`
      background-color: ${getThemeProp('palette.primary.light')};
    `}
`;

const RowContainer = styled.div``;

const Container = styled.div`
  max-height: 80vh;
  overflow: scroll;
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
    height: 7px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;

    background-color: rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
`;

const EditRowBase = styled(Box)<{ isHeader?: boolean }>`
  background-color: ${getThemeProp('palette.mainBackground')};
  width: 2rem;
  text-align: center;
  padding: ${spacing(1)};
  cursor: pointer;
  ${getThemeProp('typography.body')};
  border-right: 1px solid ${getThemeProp('palette.border')};

  ${({ isHeader }) =>
    isHeader &&
    css`
      background-color: ${getThemeProp('palette.primary.light')};
    `};
`;

const EditRowPlaceholder = styled(EditRowBase)`
  cursor: default;
`;

const EditColumnBase = styled(Column)`
  background-color: ${getThemeProp('palette.mainBackground')};
  ${getThemeProp('typography.body')};
  cursor: pointer;
  text-align: center;
  padding: ${spacing(1)};
`;

const EditColumn = ({
  onAddColumnRight,
  onAddColumnLeft,
  onRemoveColumn,
  overflow,
  ...props
}) => {
  const { t } = useTranslation();

  const overlay = (
    <DropdownMenu>
      <DropdownMenuItem onClick={onAddColumnRight}>
        {t('yleiset.lisaaSarakeOikealle')}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onAddColumnLeft}>
        {t('yleiset.lisaaSarakeVasemmalle')}
      </DropdownMenuItem>
      {_.isFunction(onRemoveColumn) ? (
        <DropdownMenuItem onClick={onRemoveColumn}>
          {t('yleiset.poistaSarake')}
        </DropdownMenuItem>
      ) : null}
    </DropdownMenu>
  );

  return (
    <Dropdown overlay={overlay} overflow={overflow}>
      {({ ref, onToggle }) => (
        <div
          style={{ display: 'flex' }}
          ref={ref as RefObject<HTMLDivElement>}
          onClick={onToggle}
        >
          <EditColumnBase {...props} />
        </div>
      )}
    </Dropdown>
  );
};

const EditRow = ({
  onAddRowBelow,
  onAddRowAbove,
  onRemoveRow,
  onToggleHeaderStatus,
  isHeader,
  overflow,
  ...props
}) => {
  const { t } = useTranslation();

  const overlay = (
    <DropdownMenu>
      <DropdownMenuItem onClick={onToggleHeaderStatus}>
        {isHeader
          ? t('yleiset.merkitseTavalliseksiRiviksi')
          : t('yleiset.merkitseOtsikkoriviksi')}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onAddRowBelow}>
        {t('yleiset.lisaaRiviAlapuolelle')}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onAddRowAbove}>
        {t('yleiset.lisaaRiviYlapuolelle')}
      </DropdownMenuItem>
      {_.isFunction(onRemoveRow) ? (
        <DropdownMenuItem onClick={onRemoveRow}>
          {t('yleiset.poistaRivi')}
        </DropdownMenuItem>
      ) : null}
    </DropdownMenu>
  );

  return (
    <Dropdown overlay={overlay} overflow={overflow}>
      {({ ref, onToggle }) => (
        <div
          style={{ display: 'flex' }}
          ref={ref as RefObject<HTMLDivElement>}
          onClick={onToggle}
        >
          <EditRowBase isHeader={isHeader} {...props} />
        </div>
      )}
    </Dropdown>
  );
};

type TableInputProps = {
  value?: TableInputValue;
  language: LanguageCode;
  onChange: (v: TableInputValue) => void;
  overflowDropdowns?: boolean;
};
class TableInput extends Component<TableInputProps> {
  static defaultProps = {
    onChange: () => {},
    language: 'fi',
    overflowDropdowns: true,
  };

  getValue() {
    return (
      this.props.value || {
        rows: [{ columns: [{ text: { [this.props.language]: '' } }] }],
      }
    );
  }

  makeOnRemoveColumn =
    ({ columnIndex }: { columnIndex: number }) =>
    () => {
      const nextValue = removeColumn({ columnIndex, value: this.getValue() });

      this.props.onChange(nextValue);
    };

  makeOnAddColumnLeft =
    ({ columnIndex }: { columnIndex: number }) =>
    () => {
      const nextValue = addColumnToIndex({
        value: this.getValue(),
        columnIndex: columnIndex - 1,
        language: this.props.language,
      });

      this.props.onChange(nextValue);
    };

  makeOnAddColumnRight =
    ({ columnIndex }: { columnIndex: number }) =>
    () => {
      const nextValue = addColumnToIndex({
        value: this.getValue(),
        columnIndex: columnIndex,
        language: this.props.language,
      });

      this.props.onChange(nextValue);
    };

  makeOnAddRowBelow =
    ({ rowIndex }: { rowIndex: number }) =>
    () => {
      const nextValue = addRowToIndex({
        value: this.getValue(),
        rowIndex: rowIndex,
        language: this.props.language,
      });

      this.props.onChange(nextValue);
    };

  makeOnAddRowAbove =
    ({ rowIndex }: { rowIndex: number }) =>
    () => {
      const nextValue = addRowToIndex({
        value: this.getValue(),
        rowIndex: rowIndex - 1,
        language: this.props.language,
      });

      this.props.onChange(nextValue);
    };

  makeOnToggleRowHeaderStatus =
    ({ rowIndex }: { rowIndex: number }) =>
    () => {
      const value = this.getValue();
      const currentStatus = Boolean(value?.rows?.[rowIndex]?.isHeader);

      this.props.onChange(
        setRowHeaderStatus({
          value,
          rowIndex,
          status: !currentStatus,
        })
      );
    };

  makeOnRemoveRow =
    ({ rowIndex }: { rowIndex: number }) =>
    () => {
      const nextValue = removeRow({ value: this.getValue(), rowIndex });

      this.props.onChange(nextValue);
    };

  makeOnColumnTextFieldChange: (props: {
    rowIndex: number;
    columnIndex: number;
  }) => React.ChangeEventHandler<HTMLTextAreaElement> =
    ({ rowIndex, columnIndex }) =>
    e => {
      const { onChange, language } = this.props;
      const value = this.getValue();

      onChange(
        setColumnFieldValue({
          value,
          language,
          rowIndex,
          columnIndex,
          field: 'text',
          fieldValue: e.target.value,
        })
      );
    };

  getColumnTextFieldValue = column => {
    const { language } = this.props;

    const path = language ? ['text', language] : ['text'];

    return _.get(column, path) || '';
  };

  handlePasteEvent: ClipboardEventHandler<HTMLTextAreaElement> = event => {
    const paste = event.clipboardData?.getData('Text');
    const rows = paste?.replace(/[\r\n]+/gm, '\r').split(/\r/) ?? [];
    const table = rows.map(cell => cell.split(/\t/));
    const { language } = this.props;

    const isTable = table.length > 1 || getMaxColumnLength(table) > 1;
    if (isTable) {
      this.props.onChange(
        setTable({ value: this.getValue(), language, table })
      );
      event.preventDefault();
    }
  };

  renderColumn = ({ column, columnIndex, rowIndex }) => {
    return (
      <Column key={`${rowIndex}.${columnIndex}`} flexGrow={0}>
        <ColumnInput
          value={this.getColumnTextFieldValue(column)}
          onPaste={this.handlePasteEvent}
          onChange={this.makeOnColumnTextFieldChange({
            rowIndex,
            columnIndex,
          })}
        />
      </Column>
    );
  };

  renderRow = ({ row, index: rowIndex, isLast, numRows }) => {
    const isHeader = Boolean(row.isHeader);

    return (
      <RowContainer key={rowIndex}>
        <Row isLast={isLast} isHeader={isHeader}>
          <EditRow
            isHeader={isHeader}
            onAddRowAbove={this.makeOnAddRowAbove({ rowIndex })}
            onAddRowBelow={this.makeOnAddRowBelow({ rowIndex })}
            onRemoveRow={
              numRows > 1 ? this.makeOnRemoveRow({ rowIndex }) : null
            }
            onToggleHeaderStatus={this.makeOnToggleRowHeaderStatus({
              rowIndex,
            })}
            overflow={this.props.overflowDropdowns}
          >
            {rowIndex + 1}
          </EditRow>
          {_.isArray(row.columns)
            ? row.columns.map((column, columnIndex) =>
                this.renderColumn({ column, columnIndex, rowIndex })
              )
            : null}
        </Row>
      </RowContainer>
    );
  };

  getRows() {
    const value = this.getValue();
    if (_.isObject(value) && _.isArray(value.rows) && value.rows.length > 0) {
      return value.rows;
    } else {
      const rowsFallback = [
        {
          columns: [{ index: 0, text: { [this.props.language]: '' } }],
        },
      ];
      this.props.onChange({ rows: rowsFallback });
      return rowsFallback;
    }
  }

  render() {
    const rows = this.getRows();
    const numberOfColumns = getNumberOfColumns(rows);

    return (
      <Container className="TableInput__">
        <Row>
          <EditRowPlaceholder>
            <Invisible>0</Invisible>
          </EditRowPlaceholder>
          {[...new Array(numberOfColumns)].map((v, columnIndex) => (
            <EditColumn
              onAddColumnLeft={this.makeOnAddColumnLeft({ columnIndex })}
              onAddColumnRight={this.makeOnAddColumnRight({
                columnIndex,
              })}
              onRemoveColumn={
                numberOfColumns > 1
                  ? this.makeOnRemoveColumn({ columnIndex })
                  : null
              }
              overflow={this.props.overflowDropdowns}
              key={columnIndex}
            >
              {columnIndex + 1}
            </EditColumn>
          ))}
        </Row>
        {rows.map((row, index) =>
          this.renderRow({
            row,
            index,
            isLast: index === rows.length - 1,
            numRows: rows.length,
          })
        )}
      </Container>
    );
  }
}

export default TableInput;
