import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import { get, isArray, isObject, isFunction } from 'lodash';
import Flex, { FlexItem } from '../Flex';
import { getThemeProp, spacing } from '../../theme';

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
} from './utils';

import Dropdown, { DropdownMenu, DropdownMenuItem } from '../Dropdown';

import useTranslation from '../useTranslation';

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

const Column = styled(FlexItem)`
  border-right: 1px solid ${getThemeProp('palette.border')};
  box-sizing: border-box;
  width: 17rem;
`;

const Row = styled(Flex).attrs({ inline: true })`
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

const Container = styled.div``;

const EditRowBase = styled(FlexItem)`
  background-color: #f5f5f5;
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
  background-color: #f5f5f5;
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
      {isFunction(onRemoveColumn) ? (
        <DropdownMenuItem onClick={onRemoveColumn}>
          {t('yleiset.poistaSarake')}
        </DropdownMenuItem>
      ) : null}
    </DropdownMenu>
  );

  return (
    <Dropdown
      overlay={overlay}
      portalTarget={document.body}
      overflow={overflow}
    >
      {({ ref, onToggle }) => (
        <div style={{ display: 'flex' }} ref={ref} onClick={onToggle}>
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
      {isFunction(onRemoveRow) ? (
        <DropdownMenuItem onClick={onRemoveRow}>
          {t('yleiset.poistaRivi')}
        </DropdownMenuItem>
      ) : null}
    </DropdownMenu>
  );

  return (
    <Dropdown
      overlay={overlay}
      portalTarget={document.body}
      overflow={overflow}
    >
      {({ ref, onToggle }) => (
        <div style={{ display: 'flex' }} ref={ref} onClick={onToggle}>
          <EditRowBase isHeader={isHeader} {...props} />
        </div>
      )}
    </Dropdown>
  );
};

class TableInput extends Component {
  static defaultProps = {
    onChange: () => {},
    language: 'fi',
    overflowDropdowns: true,
  };

  getValue() {
    return this.props.value || { rows: [{ columns: [{ text: '' }] }] };
  }

  makeOnRemoveColumn = ({ columnIndex }) => () => {
    const nextValue = removeColumn({ columnIndex, value: this.getValue() });

    this.props.onChange(nextValue);
  };

  makeOnAddColumnLeft = ({ columnIndex }) => () => {
    const nextValue = addColumnToIndex({
      value: this.getValue(),
      columnIndex: columnIndex - 1,
    });

    this.props.onChange(nextValue);
  };

  makeOnAddColumnRight = ({ columnIndex }) => () => {
    const nextValue = addColumnToIndex({ value: this.getValue(), columnIndex });

    this.props.onChange(nextValue);
  };

  makeOnAddRowBelow = ({ rowIndex }) => () => {
    const nextValue = addRowToIndex({ value: this.getValue(), rowIndex });

    this.props.onChange(nextValue);
  };

  makeOnAddRowAbove = ({ rowIndex }) => () => {
    const nextValue = addRowToIndex({
      value: this.getValue(),
      rowIndex: rowIndex - 1,
    });

    this.props.onChange(nextValue);
  };

  makeOnToggleRowHeaderStatus = ({ rowIndex }) => () => {
    const value = this.getValue();
    const currentStatus = !!get(value, ['rows', rowIndex, 'isHeader']);

    this.props.onChange(
      setRowHeaderStatus({
        value,
        rowIndex,
        status: !currentStatus,
      }),
    );
  };

  makeOnRemoveRow = ({ rowIndex }) => () => {
    const nextValue = removeRow({ value: this.getValue(), rowIndex });

    this.props.onChange(nextValue);
  };

  makeOnColumnTextFieldChange = ({ rowIndex, columnIndex }) => e => {
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
      }),
    );
  };

  getColumnTextFieldValue = column => {
    const { language } = this.props;

    const path = language ? ['text', language] : ['text'];

    return get(column, path) || '';
  };

  handlePasteEvent = event => {
    const paste = (event.clipboardData || window.clipboardData).getData('Text');
    const rows = paste.split(/\r/);
    const table = rows.map(cell => cell.split(/\t/));
    const { language } = this.props;

    const isTable = table.length > 1 || getMaxColumnLength(table) > 1;
    if (isTable) {
      this.props.onChange(
        setTable({ value: this.getValue(), language, table }),
      );
      event.preventDefault();
    }
  };

  renderColumn = ({ column, columnIndex, rowIndex }) => {
    return (
      <Column key={`${rowIndex}.${columnIndex}`} grow={0}>
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
    const isHeader = !!row.isHeader;

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
          {isArray(row.columns)
            ? row.columns.map((column, columnIndex) =>
                this.renderColumn({ column, columnIndex, rowIndex }),
              )
            : null}
        </Row>
      </RowContainer>
    );
  };

  getRows() {
    const value = this.getValue();

    return isObject(value) && isArray(value.rows) ? value.rows : [];
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
          }),
        )}
      </Container>
    );
  }
}

export default TableInput;
