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

import Badge from './Badge';
import SmallStatusTag from './StatusTag/SmallStatusTag';

export const makeOnSort =
  ({ name, onSort }) =>
  dir =>
    onSort(`${name}:${dir}`);

export const getSortDirection = ({ sort, name }) => {
  const sortWithDefault = name === 'nimi' && !sort ? 'nimi:asc' : sort;

  if (!sortWithDefault) {
    return null;
  }

  const [sortName, dir] = sortWithDefault.split(':');

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
  style?: Record<string, string | number>;
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
  style: {
    width: 'auto',
  },
});

export const makeHakuColumn = (
  t,
  {
    getLinkUrl,
  }: { getLinkUrl: (unknown) => string | undefined; title?: string }
): Column => ({
  title: t('yleiset.haku'),
  key: 'hakuNimi',
  sortable: true,
  render: item => (
    <RouterAnchor to={getLinkUrl(item)}>
      {getFirstLanguageValue(item.hakuNimi, item.language) ||
        t('yleiset.nimeton')}
    </RouterAnchor>
  ),
  style: {
    width: 'auto',
  },
});

export const makeKoulutustyyppiColumn = t => ({
  title: t('yleiset.koulutustyyppi'),
  key: 'koulutustyyppi',
  sortable: true,
  render: ({ koulutustyyppi }) =>
    getKoulutustyyppiTranslation(koulutustyyppi, t),
  style: {
    width: '180px',
  },
});

export const makeCountColumn = ({ title, key, propName }) => ({
  title,
  key,
  render: props => (
    <Box width="100%" textAlign="center">
      <Badge color="primary">{props[propName] ?? 0}</Badge>
    </Box>
  ),
  style: { width: 0 },
});

export const makeJulkinenColumn = (t): Column => ({
  title: t('yleiset.nakyvyys'),
  key: 'julkinen',
  sortable: true,
  render: ({ julkinen }) => {
    return (
      <Box textAlign="center" style={{ userSelect: 'none' }}>
        {julkinen ? (
          <Icon
            type="people"
            title={t('yleiset.julkinen')}
            aria-label={t('yleiset.julkinen')}
          />
        ) : null}
      </Box>
    );
  },
  style: {
    width: 0,
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
  style: {
    width: 0,
  },
});

export const makeModifiedColumn = (t): Column => ({
  title: t('yleiset.muokattuViimeksi'),
  key: 'modified',
  sortable: true,
  render: ({ modified }) => formatDateValue(modified),
  style: {
    width: 0,
  },
});

export const makeMuokkaajaColumn = (t): Column => ({
  title: t('yleiset.muokkaaja'),
  key: 'muokkaaja',
  sortable: true,
  render: ({ muokkaaja }) => _.get(muokkaaja, 'nimi') || null,
  style: {
    width: '170px',
  },
});

export const makeHakutapaColumn = (t, userLanguage): Column => ({
  title: t('yleiset.hakutapa'),
  key: 'hakutapa',
  sortable: true,
  render: ({ hakutapa }) => getFirstLanguageValue(hakutapa?.nimi, userLanguage),
});

export const makeKoulutuksenAlkamiskausiColumn = (t, userLanguage): Column => ({
  title: t('yleiset.koulutuksenAlkamiskausi'),
  key: 'koulutuksenAlkamiskausi',
  sortable: true,
  render: ({ koulutuksenAlkamiskausi }) =>
    koulutuksenAlkamiskausi?.koulutuksenAlkamiskausi
      ? `${getFirstLanguageValue(
          koulutuksenAlkamiskausi?.koulutuksenAlkamiskausi?.nimi,
          userLanguage
        )} ${koulutuksenAlkamiskausi?.koulutuksenAlkamisvuosi}`
      : '',
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
            const {
              key,
              title,
              sortable: isColumnSortable,
              style,
            } = columnProps;
            const sortable = isTableSortable && isColumnSortable;
            return (
              <TableCell
                key={key}
                sortDirection={
                  sortable
                    ? getSortDirection({
                        sort: sort,
                        name: key,
                      })
                    : null
                }
                onSort={sortable ? makeOnSort({ name: key, onSort }) : null}
                style={style}
              >
                {_.isFunction(title) ? title({ rows }) : title}
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
                  ({
                    key: columnKey,
                    render,
                    Component,
                    collapsible = false,
                    style,
                  }) => {
                    const columnIsCollapsed =
                      rowIsCollapsed && columnKey === collapsedColumn;

                    return (
                      <Cell
                        key={columnKey}
                        active={columnIsCollapsed}
                        noBorder={columnIsCollapsed}
                        style={style}
                        onClick={
                          collapsible
                            ? () => {
                                setCollapsed(
                                  columnIsCollapsed
                                    ? {}
                                    : { row: key, column: columnKey }
                                );
                              }
                            : undefined
                        }
                      >
                        {_.isFunction(Component) ? (
                          <Component language={language} {...rowProps} />
                        ) : (
                          render({ ...rowProps, language })
                        )}
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
