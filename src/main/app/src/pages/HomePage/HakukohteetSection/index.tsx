import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import debounce from 'debounce-promise';
import { useTranslation } from 'react-i18next';

import { ENTITY, ICONS } from '#/src/constants';
import { getTestIdProps } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import searchHakukohteet from '#/src/utils/hakukohde/searchHakukohteet';
import Anchor from '#/src/components/Anchor';
import { Box } from '#/src/components/virkailija';
import Button from '#/src/components/Button';
import useModal from '#/src/hooks/useModal';
import ErrorAlert from '#/src/components/ErrorAlert';
import Pagination from '#/src/components/Pagination';
import useApiAsync from '#/src/hooks/useApiAsync';
import ListTable, {
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeTilaColumn,
} from '#/src/components/ListTable';
import ListSpin from '#/src/components/ListSpin';
import { getIndexParamsByFilters } from '../utils';
import Filters from '../Filters';
import NavigationAnchor from '../NavigationAnchor';
import useFilterState from '../useFilterState';
import ListCollapse from '../ListCollapse';
import LiitoksetModal from './LiitoksetModal';

const { HAKUKOHDE } = ENTITY;

const debounceHakukohteet = debounce(searchHakukohteet, 300);

const getHakukohteetFn = async ({ httpClient, apiUrls, ...filters }) => {
  const params = getIndexParamsByFilters(filters);

  const { result, totalCount } = await debounceHakukohteet({
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
        to={`/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`}
      >
        {getFirstLanguageValue(nimi, language) || t('yleiset.nimeton')}
      </Anchor>
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
      <Button onClick={open}>{t('etusivu.luoUusiHakukohde')}</Button>
    </>
  );
};

const HakukohteetSection = ({ organisaatioOid, canCreate = true }) => {
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
  } = useFilterState({ paginationName: 'hakukohteet' });

  const watch = JSON.stringify([
    page,
    debouncedNimi,
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
    nimi: debouncedNimi,
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

  const tableColumns = useMemo(() => makeTableColumns(t, organisaatioOid), [
    t,
    organisaatioOid,
  ]);

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
