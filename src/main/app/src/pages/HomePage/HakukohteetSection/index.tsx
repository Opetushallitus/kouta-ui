import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { RouterAnchor } from '#/src/components/Anchor';
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
import searchHakukohteet from '#/src/utils/hakukohde/searchHakukohteet';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

import Filters from '../Filters';
import ListCollapse from '../ListCollapse';
import NavigationAnchor from '../NavigationAnchor';
import { useFilterState } from '../useFilterState';
import { getIndexParamsByFilters } from '../utils';
import LiitoksetModal from './LiitoksetModal';

const { HAKUKOHDE } = ENTITY;

const getHakukohteetFn = async ({ httpClient, apiUrls, ...filters }) => {
  const params = getIndexParamsByFilters(filters);

  const { result, totalCount } = await searchHakukohteet({
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
      <RouterAnchor
        to={`/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`}
      >
        {getFirstLanguageValue(nimi, language) || t('yleiset.nimeton')}
      </RouterAnchor>
    ),
  },
  makeTilaColumn(t),
  makeModifiedColumn(t),
  makeMuokkaajaColumn(t),
];

const Actions = ({ organisaatioOid }) => {
  const { isOpen, close, open } = useModal();
  const { t } = useTranslation();

  return (
    <>
      <LiitoksetModal
        open={isOpen}
        organisaatioOid={organisaatioOid}
        onClose={close}
      />
      <Button onClick={open}>{t('yleiset.luoUusiHakukohde')}</Button>
    </>
  );
};

const HakukohteetSection = ({ organisaatioOid, canCreate = true }) => {
  const { t } = useTranslation();

  const {
    nimi,
    showArchived,
    page,
    setPage,
    orderBy,
    setOrderBy,
    tila,
    filtersProps,
  } = useFilterState('hakukohteet');

  const watch = JSON.stringify([
    page,
    nimi,
    organisaatioOid,
    showArchived,
    orderBy,
    tila,
  ]);

  const {
    data: { result: haut, pageCount = 0 } = {},
    error,
    reload,
  } = useApiAsync({
    promiseFn: getHakukohteetFn,
    nimi,
    page,
    showArchived,
    organisaatioOid,
    orderBy,
    tila,
    watch,
  });

  const rows = useMemo(() => {
    return haut ? haut.map(haku => ({ ...haku, key: haku.oid })) : null;
  }, [haut]);

  const tableColumns = useMemo(
    () => makeTableColumns(t, organisaatioOid),
    [t, organisaatioOid]
  );

  return (
    <>
      <NavigationAnchor id="hakukohteet" />
      <ListCollapse
        icon={ICONS[HAKUKOHDE]}
        header={t('yleiset.hakukohteet')}
        actions={
          canCreate ? <Actions organisaatioOid={organisaatioOid} /> : null
        }
        defaultOpen
      >
        <Box mb={3}>
          <Filters
            {...filtersProps}
            nimiPlaceholder={t('etusivu.haeHakukohteita')}
          />
        </Box>

        {rows ? (
          <ListTable
            rows={rows}
            columns={tableColumns}
            onSort={setOrderBy}
            sort={orderBy}
            {...getTestIdProps('hakukohteetTable')}
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

export default HakukohteetSection;
