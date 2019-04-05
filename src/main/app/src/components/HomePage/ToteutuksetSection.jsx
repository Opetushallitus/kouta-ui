import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import ListCollapse from './ListCollapse';
import ListTable, {
  makeModifiedColumn,
  makeMuokkaajaColumn,
} from './ListTable';
import Pagination from '../Pagination';
import Flex from '../Flex';
import Spacing from '../Spacing';
import Spin from '../Spin';
import useApiAsync from '../useApiAsync';
import { getKoutaIndexToteutukset } from '../../apiUtils';
import { getIndexParamsByFilters } from './utils';
import Filters from './Filters';
import Badge from '../Badge';
import useFilterState from './useFilterState';
import { getFirstLanguageValue, getTestIdProps } from '../../utils';
import Anchor from '../Anchor';
import ToteutusTilaDropdown from './ToteutusTilaDropdown';
import ErrorAlert from '../ErrorAlert';
import useTranslation from '../useTranslation';

const getToteutukset = async ({ httpClient, apiUrls, ...filters }) => {
  const params = getIndexParamsByFilters(filters);

  const { result, totalCount } = await getKoutaIndexToteutukset({
    httpClient,
    apiUrls,
    ...params,
  });

  return { result, pageCount: Math.ceil(totalCount / 10) };
};

const makeTableColumns = t => [
  {
    title: t('yleiset.nimi'),
    key: 'nimi',
    sortable: true,
    render: ({ nimi, oid }) => (
      <Anchor as={Link} to={`/toteutus/${oid}/muokkaus`}>
        {getFirstLanguageValue(nimi)}
      </Anchor>
    ),
  },
  {
    title: t('yleiset.tila'),
    key: 'tila',
    sortable: true,
    render: ({ tila, oid }) => (
      <ToteutusTilaDropdown initialTila={tila} toteutusOid={oid} />
    ),
  },
  makeModifiedColumn(t),
  makeMuokkaajaColumn(t),
  {
    title: 'Kiinnitetyt haut',
    key: 'haut',
    render: ({ haut = 0 }) => <Badge color="primary">{haut}</Badge>,
  },
];

const ToteutuksetSection = ({ organisaatioOid }) => {
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
  } = useFilterState();

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
    promiseFn: getToteutukset,
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

  const tableColumns = useMemo(() => makeTableColumns(t), [t]);

  return (
    <ListCollapse icon="settings" header={t('etusivu.koulutuksenToteutukset')} defaultOpen>
      <Spacing marginBottom={2}>
        <Filters {...filtersProps} nimiPlaceholder={t('etusivu.haeToteutuksia')} />
      </Spacing>

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
        <Spin center />
      )}

      <Flex marginTop={2}>
        <Pagination value={page} onChange={setPage} pageCount={pageCount} />
      </Flex>
    </ListCollapse>
  );
};

export default ToteutuksetSection;
