import React, { Fragment, useState } from 'react';
import styled, { css } from 'styled-components';
import { get, isFunction } from 'lodash';

import Table, { TableHead, TableBody, TableRow, TableCell } from '../Table';
import { getSortDirection, makeOnSort } from './utils';
import Icon from '../Icon';
import StatusTag from '../StatusTag';
import useLanguage from '../useLanguage';
import Anchor from '../Anchor';
import Dropdown from '../Dropdown';
import { Link } from 'react-router-dom';
import { getFirstLanguageValue, formatKoutaDateString } from '../../utils';

export const makeNimiColumn = (t, { getLinkUrl }) => ({
  title: t('yleiset.nimi'),
  key: 'nimi',
  sortable: true,
  render: item => (
    <Anchor as={Link} to={getLinkUrl(item)}>
      {getFirstLanguageValue(item.nimi, item.language) || t('yleiset.nimeton')}
    </Anchor>
  ),
});

export const makeTilaColumn = t => ({
  title: t('yleiset.tila'),
  key: 'tila',
  sortable: true,
  render: ({ tila }) => <StatusTag status={tila} />,
});

export const makeModifiedColumn = t => ({
  title: t('yleiset.muokattuViimeksi'),
  key: 'modified',
  sortable: true,
  render: ({ modified }) =>
    modified ? formatKoutaDateString(modified, 'DD.MM.YYYY HH:mm') : null,
});

export const makeMuokkaajaColumn = t => ({
  title: t('yleiset.muokkaaja'),
  key: 'muokkaaja',
  sortable: true,
  render: ({ muokkaaja }) => get(muokkaaja, 'nimi') || null,
});

const ActionsIcon = styled(Icon).attrs({ type: 'more_horiz' })`
  opacity: 0.6;
  transition: opacity 0.25s;
  cursor: pointer;
  font-size: 2rem;

  ${({ active }) =>
    active &&
    css`
      opacity: 1;
    `}

  &:hover {
    opacity: 1;
  }
`;

const ActionsDropdown = ({ actionsMenu }) => {
  return (
    <Dropdown overlay={actionsMenu} portalTarget={document.body} overflow>
      {({ ref, onToggle, open }) => (
        <div ref={ref} onClick={onToggle} style={{ display: 'inline-block' }}>
          <ActionsIcon active={open} />
        </div>
      )}
    </Dropdown>
  );
};

const Cell = styled(TableCell)`
  ${({ onClick }) =>
    isFunction(onClick) &&
    css`
      cursor: pointer;
    `}
`;

export const ListTable = ({
  onSort,
  sort,
  columns = [],
  rows = [],
  renderActionsMenu,
  defaultCollapsedRow = null,
  defaultCollapsedColumn = null,
  ...props
}) => {
  const [collapsed, setCollapsed] = useState({
    row: defaultCollapsedRow,
    column: defaultCollapsedColumn,
  });
  const isTableSortable = isFunction(onSort);

  const language = useLanguage();

  const { row: collapsedRow, column: collapsedColumn } = collapsed;

  const columnCount = columns.length;

  return (
    <Table {...props}>
      <TableHead>
        <TableRow>
          {columns.map(columnProps => {
            const { key, title, sortable: isColumnSortable } = columnProps;
            const sortable = isTableSortable && isColumnSortable;
            return (
              <TableCell
                key={key}
                sortDirection={
                  sortable ? getSortDirection({ sort, name: key }) : null
                }
                onSort={sortable ? makeOnSort({ name: key, onSort }) : null}
              >
                {title}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(rowProps => {
          const { key } = rowProps;
          const rowIsCollapsed = collapsedRow === key;

          return (
            <Fragment key={key}>
              <TableRow>
                {columns.map(
                  ({ key: columnKey, render, collapsible = false }) => {
                    const columnIsCollapsed =
                      rowIsCollapsed && columnKey === collapsedColumn;

                    return (
                      <Cell
                        key={columnKey}
                        active={columnIsCollapsed}
                        noBorder={columnIsCollapsed}
                        onClick={
                          collapsible
                            ? () => {
                                setCollapsed(
                                  columnIsCollapsed
                                    ? {}
                                    : { row: key, column: columnKey }
                                );
                              }
                            : null
                        }
                      >
                        {render({ ...rowProps, language })}
                      </Cell>
                    );
                  }
                )}
                {renderActionsMenu ? (
                  <TableCell textCenter>
                    <ActionsDropdown
                      actionsMenu={renderActionsMenu(rowProps)}
                    />
                  </TableCell>
                ) : null}
              </TableRow>
              {rowIsCollapsed ? (
                <TableRow>
                  <TableCell colSpan={columnCount} active />
                </TableRow>
              ) : null}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ListTable;
