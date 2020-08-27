import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import debounce from 'debounce-promise';

import { ENTITY, ICONS } from '#/src/constants';
import { getTestIdProps } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

import searchKoulutukset from '#/src/utils/koulutus/searchKoulutukset';
import Anchor from '#/src/components/Anchor';
import Button from '#/src/components/Button';
import Pagination from '#/src/components/Pagination';
import Flex from '#/src/components/Flex';
import Spacing from '#/src/components/Spacing';
import useApiAsync from '#/src/hooks/useApiAsync';
import Badge from '#/src/components/Badge';
import ErrorAlert from '#/src/components/ErrorAlert';
import ListTable, {
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeTilaColumn,
} from '#/src/components/ListTable';
import ListSpin from '#/src/components/ListSpin';
import { getIndexParamsByFilters } from './utils';
import Filters from './Filters';
import NavigationAnchor from './NavigationAnchor';
import ListCollapse from './ListCollapse';
import useFilterState from './useFilterState';

const { KOULUTUS } = ENTITY;

const debounceKoulutukset = debounce(searchKoulutukset, 300);

const getKoulutuksetFn = async ({ httpClient, apiUrls, ...filters }) => {
  const params = getIndexParamsByFilters(filters);

  const { result, totalCount } = await debounceKoulutukset({
    httpClient,
    apiUrls,
    ...params,
  });

  return { result, pageCount: Math.ceil(totalCount / 10) };
};

const Actions = ({ organisaatioOid }) => {
  const { t } = useTranslation();

  return (
    <Button as={Link} to={`/organisaatio/${organisaatioOid}/koulutus`}>
      {t('etusivu.luoUusiKoulutus')}
    </Button>
  );
};

const makeTableColumns = (t, organisaatioOid) => [
  {
    title: t('yleiset.nimi'),
    key: 'nimi',
    sortable: true,
    render: ({ nimi, oid, language }) => (
      <Anchor
        as={Link}
        to={`/organisaatio/${organisaatioOid}/koulutus/${oid}/muokkaus`}
      >
        {getFirstLanguageValue(nimi, language) || t('yleiset.nimeton')}
      </Anchor>
    ),
  },
  makeTilaColumn(t),
  makeModifiedColumn(t),
  makeMuokkaajaColumn(t),
  {
    title: t('etusivu.kiinnitetytToteutukset'),
    key: 'toteutukset',
    render: ({ toteutukset = 0 }) => (
      <Badge color="primary">{toteutukset}</Badge>
    ),
  },
];

const KoulutuksetSection = ({ organisaatioOid, canCreate = true }) => {
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
  } = useFilterState({ paginationName: 'koulutukset' });

  const watch = JSON.stringify([
    page,
    debouncedNimi,
    organisaatioOid,
    showArchived,
    orderBy,
    tila,
  ]);

  const {
    data: { result: koulutukset, pageCount = 0 } = {},
    error,
    reload,
  } = useApiAsync({
    promiseFn: getKoulutuksetFn,
    nimi: debouncedNimi,
    page,
    showArchived,
    organisaatioOid,
    orderBy,
    tila,
    watch,
  });

  const rows = useMemo(() => {
    return koulutukset
      ? koulutukset.map(koulutus => ({ ...koulutus, key: koulutus.oid }))
      : null;
  }, [koulutukset]);

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

        {rows ? (
          <ListTable
            rows={rows}
            columns={tableColumns}
            onSort={setOrderBy}
            sort={orderBy}
            {...getTestIdProps('koulutuksetTable')}
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

export default KoulutuksetSection;
