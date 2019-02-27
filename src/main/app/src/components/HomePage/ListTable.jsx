import React from 'react';
import styled, { css } from 'styled-components';
import get from 'lodash/get';

import Table, { TableHead, TableBody, TableRow, TableCell } from '../Table';
import { getSortDirection, makeOnSort } from './utils';
import Icon from '../Icon';
import TilaLabel from './TilaLabel';
import { formatKoutaDateString } from '../../utils';

import {
  UncontrolledDropdown,
} from '../Dropdown';

export const makeTilaColumn = () => ({
  title: 'Tila',
  key: 'tila',
  sortable: true,
  render: ({ tila }) => <TilaLabel tila={tila} />,
});

export const makeModifiedColumn = () => ({
  title: 'Muokattu viimeksi',
  key: 'modified',
  sortable: true,
  render: ({ modified }) =>
    modified
      ? formatKoutaDateString(modified, 'DD.MM.YYYY HH:mm')
      : null,
});

export const makeMuokkaajaColumn = () => ({
  title: 'Muokkaaja',
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
    <UncontrolledDropdown
      overlay={actionsMenu}
      portalTarget={document.body}
      overflow
    >
      {({ ref, onToggle, visible }) => (
        <div ref={ref} onClick={onToggle} style={{ display: 'inline-block' }}>
          <ActionsIcon active={visible} />
        </div>
      )}
    </UncontrolledDropdown>
  );
};

export const ListTable = ({
  onSort,
  sort,
  columns = [],
  rows = [],
  renderActionsMenu,
}) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map(columnProps => {
            const { key, title, sortable = false } = columnProps;

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

          return (
            <TableRow key={key}>
              {columns.map(({ key: columnKey, render }) => (
                <TableCell key={columnKey}>{render(rowProps)}</TableCell>
              ))}
              {renderActionsMenu ? (
                <TableCell textCenter>
                  <ActionsDropdown actionsMenu={renderActionsMenu(rowProps)} />
                </TableCell>
              ) : null}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ListTable;
