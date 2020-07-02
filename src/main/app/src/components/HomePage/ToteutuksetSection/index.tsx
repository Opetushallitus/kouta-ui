import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import debounce from 'debounce-promise';
import { useTranslation } from 'react-i18next';

import { ENTITY, ICONS } from '#/src/constants';

import { getFirstLanguageValue, getTestIdProps } from '#/src/utils';
import getToteutukset from '#/src/utils/koutaSearch/getToteutukset';
import Anchor from '#/src/components/Anchor';
import ErrorAlert from '#/src/components/ErrorAlert';
import Button from '#/src/components/Button';
import useModal from '#/src/components/useModal';
import Pagination from '#/src/components/Pagination';
import Box from '#/src/components/Box';
import Badge from '#/src/components/Badge';
import useApiAsync from '#/src/components/useApiAsync';
import { getIndexParamsByFilters } from '../utils';
import Filters from '../Filters';
import useFilterState from '../useFilterState';
import ListSpin from '../ListSpin';
import NavigationAnchor from '../NavigationAnchor';
import KoulutusModal from './KoulutusModal';
import ListCollapse from '../ListCollapse';

import ListTable, {
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeTilaColumn,
} from '../ListTable';

const { TOTEUTUS } = ENTITY;

const debounceToteutukset = debounce(getToteutukset, 300);

const getToteutuksetFn = async ({ httpClient, apiUrls, ...filters }) => {
  const params = getIndexParamsByFilters(filters);

  const { result, totalCount } = await debounceToteutukset({
    httpClient,
    apiUrls,
    ...params,
  });

  return { result, pageCount: Math.ceil(totalCount / 10) };
};

const makeTableColumns = (t, organisaatioOid) => [
  {
    title: t('yleiset.nimi'),
    key: 'nimi',
    sortable: true,
    render: ({ nimi, oid, language }) => (
      <Anchor
        as={Link}
        to={`/organisaatio/${organisaatioOid}/toteutus/${oid}/muokkaus`}
      >
        {getFirstLanguageValue(nimi, language) || t('yleiset.nimeton')}
      </Anchor>
    ),
  },
  makeTilaColumn(t),
  makeModifiedColumn(t),
  makeMuokkaajaColumn(t),
  {
    title: t('etusivu.kiinnitetytHakukohteet'),
    key: 'hakukohteet',
    render: ({ hakukohteet = 0 }) => (
      <Badge color="primary">{hakukohteet}</Badge>
    ),
  },
];

const Actions = ({ organisaatioOid }) => {
  const { isOpen, close, open } = useModal();
  const { t } = useTranslation();

  return (
    <>
      <KoulutusModal
        open={isOpen}
        organisaatioOid={organisaatioOid}
        onClose={close}
      />
      <Button onClick={open}>{t('etusivu.luoUusiToteutus')}</Button>
    </>
  );
};

const ToteutuksetSection = ({ organisaatioOid, canCreate = true }) => {
  const { t } = useTranslation();

  const {
    debouncedNimi,
    showArchived,
    page,
    setPage,
    orderBy,
    setOrderBy,
    tila,
    filtersProps,
  } = useFilterState({ paginationName: 'toteutukset' });

  const watch = JSON.stringify([
    page,
    debouncedNimi,
    organisaatioOid,
    showArchived,
    orderBy,
    tila,
  ]);

  const {
    data: { result: toteutukset, pageCount = 0 } = {},
    error,
    reload,
  } = useApiAsync({
    promiseFn: getToteutuksetFn,
    nimi: debouncedNimi,
    page,
    showArchived,
    organisaatioOid,
    orderBy,
    tila,
    watch,
  });

  const rows = useMemo(() => {
    return toteutukset
      ? toteutukset.map(toteutus => ({ ...toteutus, key: toteutus.oid }))
      : null;
  }, [toteutukset]);

  const tableColumns = useMemo(() => makeTableColumns(t, organisaatioOid), [
    t,
    organisaatioOid,
  ]);

  return (
    <>
      <NavigationAnchor id="toteutukset" />
      <ListCollapse
        icon={ICONS[TOTEUTUS]}
        header={t('yleiset.toteutukset')}
        actions={
          canCreate ? <Actions organisaatioOid={organisaatioOid} /> : null
        }
        defaultOpen
      >
        <Box mb={3}>
          <Filters
            {...filtersProps}
            nimiPlaceholder={t('etusivu.haeToteutuksia')}
          />
        </Box>

        {rows ? (
          <ListTable
            rows={rows}
            columns={tableColumns}
            onSort={setOrderBy}
            sort={orderBy}
            {...getTestIdProps('toteutuksetTable')}
          />
        ) : error ? (
          <ErrorAlert onReload={reload} center />
        ) : (
          <ListSpin />
        )}

        <Box mt={3} display="flex" justifyContent="center">
          <Pagination value={page} onChange={setPage} pageCount={pageCount} />
        </Box>
      </ListCollapse>
    </>
  );
};

export default ToteutuksetSection;
