import React, { useMemo } from 'react';

import debounce from 'debounce-promise';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Anchor from '#/src/components/Anchor';
import Badge from '#/src/components/Badge';
import Button from '#/src/components/Button';
import ErrorAlert from '#/src/components/ErrorAlert';
import ListSpin from '#/src/components/ListSpin';
import ListTable, {
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeTilaColumn,
} from '#/src/components/ListTable';
import Pagination from '#/src/components/Pagination';
import { Box } from '#/src/components/virkailija';
import { ENTITY, ICONS } from '#/src/constants';
import useApiAsync from '#/src/hooks/useApiAsync';
import useModal from '#/src/hooks/useModal';
import { getTestIdProps } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import searchToteutukset from '#/src/utils/toteutus/searchToteutukset';

import Filters from '../Filters';
import ListCollapse from '../ListCollapse';
import NavigationAnchor from '../NavigationAnchor';
import useFilterState from '../useFilterState';
import { getIndexParamsByFilters } from '../utils';
import { KoulutusModal } from './KoulutusModal';

const { TOTEUTUS } = ENTITY;

const debounceToteutukset = debounce(searchToteutukset, 300);

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
    render: ({ hakukohdeCount = 0 }) => (
      <Badge color="primary">{hakukohdeCount}</Badge>
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
      <Button onClick={open}>{t('yleiset.luoUusiToteutus')}</Button>
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
