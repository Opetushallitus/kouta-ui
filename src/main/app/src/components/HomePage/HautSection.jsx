import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import ListCollapse from './ListCollapse';
import ListTable, {
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeTilaColumn,
} from './ListTable';
import Button from '../Button';
import Pagination from '../Pagination';
import Flex from '../Flex';
import Spacing from '../Spacing';
import ListSpin from './ListSpin';
import useApiAsync from '../useApiAsync';
import { getIndexParamsByFilters } from './utils';
import Filters from './Filters';
import Badge from '../Badge';
import useFilterState from './useFilterState';
import ErrorAlert from '../ErrorAlert';
import Anchor from '../Anchor';
import useTranslation from '../useTranslation';
import getHaut from '../../utils/koutaSearch/getHaut';
import useInView from '../useInView';
import NavigationAnchor from './NavigationAnchor';
import { getFirstLanguageValue, getTestIdProps } from '../../utils';

const getHautFn = async ({ httpClient, apiUrls, ...filters }) => {
  const params = getIndexParamsByFilters(filters);

  const { result, totalCount } = await getHaut({
    httpClient,
    apiUrls,
    ...params,
  });

  return { result, pageCount: Math.ceil(totalCount / 10) };
};

const noopPromiseFn = () => Promise.resolve();

const Actions = ({ organisaatioOid }) => {
  const { t } = useTranslation();

  return (
    <Button as={Link} to={`/organisaatio/${organisaatioOid}/haku`}>
      {t('etusivu.luoUusiHaku')}
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

  const [ref, inView] = useInView({
    threshold: 0.25,
    triggerOnce: true,
  });

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
    data: { result: haut, pageCount = 0 } = {},
    error,
    reload,
  } = useApiAsync({
    promiseFn: inView ? getHautFn : noopPromiseFn,
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
        icon="access_time"
        header={t('yleiset.haut')}
        actions={
          canCreate ? <Actions organisaatioOid={organisaatioOid} /> : null
        }
        defaultOpen
      >
        <div ref={ref} />

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
