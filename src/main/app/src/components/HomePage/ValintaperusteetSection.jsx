import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import debounce from 'debounce-promise';
import { useTranslation } from 'react-i18next';

import { ENTITY, ICONS } from '#/src/constants';
import { getFirstLanguageValue, getTestIdProps } from '#/src/utils';
import getValintaperusteet from '#/src/utils/koutaSearch/getValintaperusteet';
import Pagination from '#/src/components/Pagination';
import Flex from '#/src/components/Flex';
import Spacing from '#/src/components/Spacing';
import useApiAsync from '#/src/components/useApiAsync';
import Anchor from '#/src/components/Anchor';
import Button from '#/src/components/Button';
import ErrorAlert from '#/src/components/ErrorAlert';
import { getIndexParamsByFilters } from './utils';
import Filters from './Filters';
import useFilterState from './useFilterState';
import ListSpin from './ListSpin';
import NavigationAnchor from './NavigationAnchor';
import ListCollapse from './ListCollapse';
import ListTable, {
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeTilaColumn,
} from './ListTable';

const { VALINTAPERUSTE } = ENTITY;

const debounceValintaperusteet = debounce(getValintaperusteet, 300);

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
      {t('etusivu.luoUusiValintaperuste')}
    </Button>
  );
};

const makeTableColumns = (t, organisaatioOid) => [
  {
    title: t('yleiset.nimi'),
    key: 'nimi',
    sortable: true,
    render: ({ nimi, id }) => (
      <Anchor
        as={Link}
        to={`/organisaatio/${organisaatioOid}/valintaperusteet/${id}/muokkaus`}
      >
        {getFirstLanguageValue(nimi) || t('yleiset.nimeton')}
      </Anchor>
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
