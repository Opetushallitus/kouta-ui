import React, { useMemo } from 'react';

import debounce from 'debounce-promise';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Anchor from '#/src/components/Anchor';
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
import useApiAsync from '#/src/hooks/useApiAsync';
import { getTestIdProps } from '#/src/utils';
import searchHaut from '#/src/utils/haku/searchHaut';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

import Filters from './Filters';
import ListCollapse from './ListCollapse';
import NavigationAnchor from './NavigationAnchor';
import useFilterState from './useFilterState';
import { getIndexParamsByFilters } from './utils';

const { HAKU } = ENTITY;

const debounceHaut = debounce(searchHaut, 300);

const getHautFn = async ({ httpClient, apiUrls, ...filters }) => {
  const params = getIndexParamsByFilters(filters);

  const { result, totalCount } = await debounceHaut({
    httpClient,
    apiUrls,
    ...params,
  });

  return { result, pageCount: Math.ceil(totalCount / 10) };
};

const Actions = ({ organisaatioOid }) => {
  const { t } = useTranslation();

  return (
    <Button as={Link} to={`/organisaatio/${organisaatioOid}/haku`}>
      {t('yleiset.luoUusiHaku')}
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
        to={`/organisaatio/${organisaatioOid}/haku/${oid}/muokkaus`}
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

const KoulutuksetSection = ({ organisaatioOid, canCreate }) => {
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
  } = useFilterState({ paginationName: 'haut' });

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
    promiseFn: getHautFn,
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
      <NavigationAnchor id="haut" />
      <ListCollapse
        icon={ICONS[HAKU]}
        header={t('yleiset.haut')}
        actions={
          canCreate ? <Actions organisaatioOid={organisaatioOid} /> : null
        }
        defaultOpen
      >
        <Spacing marginBottom={3}>
          <Filters {...filtersProps} nimiPlaceholder={t('etusivu.haeHakuja')} />
        </Spacing>

        {rows ? (
          <ListTable
            rows={rows}
            columns={tableColumns}
            onSort={setOrderBy}
            sort={orderBy}
            {...getTestIdProps('hautTable')}
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
