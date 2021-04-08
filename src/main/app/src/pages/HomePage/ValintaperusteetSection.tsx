import React, { useMemo } from 'react';

import debounce from 'debounce-promise';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Anchor, { RouterAnchor } from '#/src/components/Anchor';
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
import useApiAsync from '#/src/hooks/useApiAsync';
import { getTestIdProps } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import searchValintaperusteet from '#/src/utils/valintaperuste/searchValintaperusteet';

import Filters from './Filters';
import ListCollapse from './ListCollapse';
import NavigationAnchor from './NavigationAnchor';
import useFilterState from './useFilterState';
import { getIndexParamsByFilters } from './utils';

const { VALINTAPERUSTE } = ENTITY;

const debounceValintaperusteet = debounce(searchValintaperusteet, 300);

const getValintaperusteetFn = async ({ httpClient, apiUrls, ...filters }) => {
  const params = getIndexParamsByFilters(filters);

  const { result, totalCount } = await debounceValintaperusteet({
    httpClient,
    apiUrls,
    ...params,
  });

  return { result, pageCount: Math.ceil(totalCount / 10) };
};

const Actions = ({ organisaatioOid }) => {
  const { t } = useTranslation();

  return (
    <Button
      as={Link}
      to={`/organisaatio/${organisaatioOid}/valintaperusteet/kielivalinnat/`}
    >
      {t('yleiset.luoUusiValintaperuste')}
    </Button>
  );
};

const makeTableColumns = (t, organisaatioOid) => [
  {
    title: t('yleiset.nimi'),
    key: 'nimi',
    sortable: true,
    render: ({ nimi, id }) => (
      <RouterAnchor
        to={`/organisaatio/${organisaatioOid}/valintaperusteet/${id}/muokkaus`}
      >
        {getFirstLanguageValue(nimi) || t('yleiset.nimeton')}
      </RouterAnchor>
    ),
  },
  makeTilaColumn(t),
  makeModifiedColumn(t),
  makeMuokkaajaColumn(t),
];

const ValintaperusteetSection = ({ organisaatioOid, canCreate = true }) => {
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
  } = useFilterState({ paginationName: 'valintaperusteet' });

  const watch = JSON.stringify([
    page,
    debouncedNimi,
    organisaatioOid,
    showArchived,
    orderBy,
    tila,
  ]);

  const {
    data: { result: valintaperusteet, pageCount = 0 } = {},
    error,
    reload,
  } = useApiAsync({
    promiseFn: getValintaperusteetFn,
    nimi: debouncedNimi,
    page,
    showArchived,
    organisaatioOid,
    orderBy,
    tila,
    watch,
  });

  const rows = useMemo(() => {
    return valintaperusteet
      ? valintaperusteet.map(valintaperuste => ({
          ...valintaperuste,
          key: valintaperuste.id,
        }))
      : null;
  }, [valintaperusteet]);

  const tableColumns = useMemo(() => makeTableColumns(t, organisaatioOid), [
    t,
    organisaatioOid,
  ]);

  return (
    <>
      <NavigationAnchor id="valintaperusteet" />
      <ListCollapse
        icon={ICONS[VALINTAPERUSTE]}
        header={t('yleiset.valintaperusteet')}
        actions={
          canCreate ? <Actions organisaatioOid={organisaatioOid} /> : null
        }
        defaultOpen
      >
        <Spacing marginBottom={3}>
          <Filters
            {...filtersProps}
            nimiPlaceholder={t('etusivu.haeValintaperusteita')}
          />
        </Spacing>

        {rows ? (
          <ListTable
            rows={rows}
            columns={tableColumns}
            onSort={setOrderBy}
            sort={orderBy}
            {...getTestIdProps('valintaperusteetTable')}
          />
        ) : error ? (
          <ErrorAlert onReload={reload} center />
        ) : (
          <ListSpin />
        )}

        <Flex marginTop={3} justifyCenter>
          <Pagination value={page} onChange={setPage} pageCount={pageCount} />
        </Flex>
      </ListCollapse>
    </>
  );
};

export default ValintaperusteetSection;
