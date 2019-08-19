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
import ListSpin from './ListSpin';
import useApiAsync from '../useApiAsync';
import getToteutukset from '../../utils/koutaIndex/getToteutukset';
import { getIndexParamsByFilters } from './utils';
import Filters from './Filters';
import Badge from '../Badge';
import useFilterState from './useFilterState';
import { getFirstLanguageValue, getTestIdProps } from '../../utils';
import Anchor from '../Anchor';
import ToteutusTilaDropdown from './ToteutusTilaDropdown';
import ErrorAlert from '../ErrorAlert';
import useTranslation from '../useTranslation';
import useInView from '../useInView';
import NavigationAnchor from './NavigationAnchor';

const noopPromiseFn = () => Promise.resolve();

const getToteutuksetFn = async ({ httpClient, apiUrls, ...filters }) => {
  const params = getIndexParamsByFilters(filters);

  const { result, totalCount } = await getToteutukset({
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
    render: ({ nimi, oid, language }) => (
      <Anchor as={Link} to={`/toteutus/${oid}/muokkaus`}>
        {getFirstLanguageValue(nimi, language) || t('yleiset.nimeton')}
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

  const [ref, inView] = useInView({ threshold: 0.25, triggerOnce: true });

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
    promiseFn: inView ? getToteutuksetFn : noopPromiseFn,
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
    <>
      <NavigationAnchor id="toteutukset" />
      <ListCollapse
        icon="settings"
        header={t('yleiset.toteutukset')}
        defaultOpen
      >
        <div ref={ref} />

        <Spacing marginBottom={3}>
          <Filters
            {...filtersProps}
            nimiPlaceholder={t('etusivu.haeToteutuksia')}
          />
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
          <ListSpin />
        )}

        <Flex marginTop={3} justifyCenter>
          <Pagination value={page} onChange={setPage} pageCount={pageCount} />
        </Flex>
      </ListCollapse>
    </>
  );
};

export default ToteutuksetSection;
