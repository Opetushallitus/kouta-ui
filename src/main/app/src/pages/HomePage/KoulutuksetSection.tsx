import React, { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { RouterAnchor } from '#/src/components/Anchor';
import Badge from '#/src/components/Badge';
import Button from '#/src/components/Button';
import ErrorAlert from '#/src/components/ErrorAlert';
import { Flex } from '#/src/components/Flex';
import ListSpin from '#/src/components/ListSpin';
import ListTable, {
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeTilaColumn,
} from '#/src/components/ListTable';
import Pagination from '#/src/components/Pagination';
import Spacing from '#/src/components/Spacing';
import { ENTITY, ICONS } from '#/src/constants';
import { getTestIdProps } from '#/src/utils';
import {
  FILTER_PAGE_SIZE,
  useSearchKoulutukset,
} from '#/src/utils/koulutus/searchKoulutukset';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

import Filters from './Filters';
import ListCollapse from './ListCollapse';
import NavigationAnchor from './NavigationAnchor';
import { useFilterState } from './useFilterState';
import { getIndexParamsByFilters } from './utils';

const { KOULUTUS } = ENTITY;

const Actions = ({ organisaatioOid }) => {
  const { t } = useTranslation();

  return (
    <Button as={Link} to={`/organisaatio/${organisaatioOid}/koulutus`}>
      {t('yleiset.luoUusiKoulutus')}
    </Button>
  );
};

const makeTableColumns = (t, organisaatioOid) => [
  {
    title: t('yleiset.nimi'),
    key: 'nimi',
    sortable: true,
    render: ({ nimi, oid, language }) => (
      <RouterAnchor
        to={`/organisaatio/${organisaatioOid}/koulutus/${oid}/muokkaus`}
      >
        {getFirstLanguageValue(nimi, language) || t('yleiset.nimeton')}
      </RouterAnchor>
    ),
  },
  makeTilaColumn(t),
  makeModifiedColumn(t),
  makeMuokkaajaColumn(t),
  {
    title: t('etusivu.kiinnitetytToteutukset'),
    key: 'toteutukset',
    render: ({ toteutusCount = 0 }) => (
      <Badge color="primary">{toteutusCount}</Badge>
    ),
  },
];

export const KoulutuksetSection = ({ organisaatioOid, canCreate = true }) => {
  const { t } = useTranslation();

  const filterState = useFilterState('koulutukset');

  const { page, setPage, orderBy, setOrderBy, filtersProps } = filterState;

  const params = useMemo(
    () => getIndexParamsByFilters({ ...filterState, organisaatioOid }),
    [filterState, organisaatioOid]
  );

  const {
    data: { result: koulutukset, totalCount } = {},
    isError,
    isFetching,
    isSuccess,
    refetch,
  } = useSearchKoulutukset(params);

  const [pageCount, setPageCount] = useState(0);
  useEffect(() => {
    if (totalCount !== undefined) {
      setPageCount(Math.ceil(totalCount / FILTER_PAGE_SIZE));
    }
  }, [totalCount]);

  const rows = useMemo(
    () =>
      koulutukset
        ? koulutukset.map(koulutus => ({ ...koulutus, key: koulutus.oid }))
        : null,
    [koulutukset]
  );

  const tableColumns = useMemo(() => makeTableColumns(t, organisaatioOid), [
    t,
    organisaatioOid,
  ]);

  return (
    <>
      <NavigationAnchor id="koulutukset" />
      <ListCollapse
        icon={ICONS[KOULUTUS]}
        header={t('yleiset.koulutukset')}
        actions={
          canCreate ? <Actions organisaatioOid={organisaatioOid} /> : null
        }
        defaultOpen
      >
        <Spacing marginBottom={3}>
          <Filters
            {...filtersProps}
            nimiPlaceholder={t('etusivu.haeKoulutuksia')}
          />
        </Spacing>

        {isFetching && <ListSpin />}
        {isError && <ErrorAlert onReload={refetch} center />}
        {isSuccess && (
          <ListTable
            rows={rows}
            columns={tableColumns}
            onSort={setOrderBy}
            sort={orderBy}
            {...getTestIdProps('koulutuksetTable')}
          />
        )}

        <Flex marginTop={3} justifyCenter>
          <Pagination value={page} onChange={setPage} pageCount={pageCount} />
        </Flex>
      </ListCollapse>
    </>
  );
};
