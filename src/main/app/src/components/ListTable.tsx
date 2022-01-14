import React, { Fragment, useState } from 'react';

import Box from '@opetushallitus/virkailija-ui-components/Box';
import _ from 'lodash';
import styled, { css } from 'styled-components';

import { RouterAnchor } from '#/src/components/Anchor';
import Table, {
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '#/src/components/Table';
import { Icon, Dropdown } from '#/src/components/virkailija';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { formatDateValue, getKoulutustyyppiTranslation } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

import SmallStatusTag from './StatusTag/SmallStatusTag';

export const makeOnSort =
  ({ name, onSort }) =>
  dir =>
    onSort(`${name}:${dir}`);

export const getSortDirection = ({ sort, name }) => {
  if (!sort) {
    return null;
  }

  const [sortName, dir] = sort.split(':');

  if (!dir) {
    return null;
  }

  return sortName === name ? dir : null;
};

type Column = {
  title?: string;
  key: string;
  sortable: boolean;
  render: (any) => React.ReactNode;
};

export const makeNimiColumn = (
  t,
  {
    getLinkUrl,
    title,
  }: { getLinkUrl: (unknown) => string | undefined; title?: string }
): Column => ({
  title: title ?? t('yleiset.nimi'),
  key: 'nimi',
  sortable: true,
  render: item => (
    <RouterAnchor to={getLinkUrl(item)}>
      {getFirstLanguageValue(item.nimi, item.language) || t('yleiset.nimeton')}
    </RouterAnchor>
  ),
});

export const makeKoulutustyyppiColumn = t => ({
  title: t('yleiset.koulutustyyppi'),
  key: 'koulutustyyppi',
  sortable: true,
  render: ({ koulutustyyppi }) =>
    getKoulutustyyppiTranslation(koulutustyyppi, t),
});

export const makeJulkinenColumn = (t): Column => ({
  title: t('yleiset.julkinen'),
  key: 'julkinen',
  sortable: false,
  render: ({ julkinen }) => {
    console.log({ julkinen });
    return (
      <Box textAlign="center">
        {' '}
        {julkinen ? (
          <Icon type="public" color="green" />
        ) : (
          <Icon type="public_off" color="red" />
        )}
      </Box>
    );
  },
});

export const makeOrganisaatioColumn = (t): Column => ({
  title: t('yleiset.organisaatio'),
  key: 'organisaatio',
  sortable: true,
  render: ({ organisaatio }) =>
    getFirstLanguageValue(organisaatio?.nimi, organisaatio?.language),
});

export const makeTilaColumn = (t): Column => ({
  title: t('yleiset.tila'),
  key: 'tila',
  sortable: true,
  render: ({ tila }) => <SmallStatusTag status={tila} />,
});

export const makeModifiedColumn = (t): Column => ({
  title: t('yleiset.muokattuViimeksi'),
  key: 'modified',
  sortable: true,
  render: ({ modified }) => formatDateValue(modified),
});

export const makeMuokkaajaColumn = (t): Column => ({
  title: t('yleiset.muokkaaja'),
  key: 'muokkaaja',
  sortable: true,
  render: ({ muokkaaja }) => _.get(muokkaaja, 'nimi') || null,
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
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          onClick={onToggle}
          style={{ display: 'inline-block' }}
        >
          <ActionsIcon active={open} />
        </div>
      )}
    </Dropdown>
  );
};

const Cell = styled(TableCell)`
  ${({ onClick }) =>
    _.isFunction(onClick) &&
    css`
      cursor: pointer;
    `}
`;

type ListTableProps = {
  onSort?: (string) => any;
  sort?: boolean;
  columns?: Array<any>;
  rows?: Array<any>;
  renderActionsMenu?: (any) => void;
  defaultCollapsedRow?: string;
  defaultCollapsedColumn?: string;
};

export const ListTable = ({
  onSort,
  sort = false,
  columns = [],
  rows = [],
  renderActionsMenu,
  defaultCollapsedRow,
  defaultCollapsedColumn,
  ...props
}: ListTableProps) => {
  const [collapsed, setCollapsed] = useState<{
    row?: string;
    column?: string;
  }>({
    row: defaultCollapsedRow,
    column: defaultCollapsedColumn,
  });
  const isTableSortable = _.isFunction(onSort);

  const language = useUserLanguage();

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
