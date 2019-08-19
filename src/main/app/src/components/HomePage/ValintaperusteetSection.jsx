import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import ListCollapse from './ListCollapse';
import ListTable, {
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeTilaColumn,
} from './ListTable';
import Pagination from '../Pagination';
import Flex from '../Flex';
import Spacing from '../Spacing';
import ListSpin from './ListSpin';
import useApiAsync from '../useApiAsync';
import { getIndexParamsByFilters } from './utils';
import getValintaperusteet from '../../utils/koutaIndex/getValintaperusteet';
import Filters from './Filters';
import useFilterState from './useFilterState';
import { getFirstLanguageValue, getTestIdProps } from '../../utils';
import Anchor from '../Anchor';
import Button from '../Button';
import ErrorAlert from '../ErrorAlert';
import useTranslation from '../useTranslation';
import useInView from '../useInView';
import NavigationAnchor from './NavigationAnchor';

const noopPromiseFn = () => Promise.resolve();

const getValintaperusteetFn = async ({ httpClient, apiUrls, ...filters }) => {
  const params = getIndexParamsByFilters(filters);

  const { result, totalCount } = await getValintaperusteet({
    httpClient,
    apiUrls,
    ...params,
  });

  return { result, pageCount: Math.ceil(totalCount / 10) };
};

const Actions = ({ organisaatioOid }) => {
  const { t } = useTranslation();

  return (
    <Button as={Link} to={`/organisaatio/${organisaatioOid}/valintaperusteet`}>
      {t('etusivu.luoUusiValintaperuste')}
    </Button>
  );
};

const makeTableColumns = t => [
  {
    title: t('yleiset.nimi'),
    key: 'nimi',
    sortable: true,
    render: ({ nimi, id }) => (
      <Anchor as={Link} to={`/valintaperusteet/${id}/muokkaus`}>
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
    data: { result: valintaperusteet, pageCount = 0 } = {},
    error,
    reload,
  } = useApiAsync({
    promiseFn: inView ? getValintaperusteetFn : noopPromiseFn,
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

  const tableColumns = useMemo(() => makeTableColumns(t), [t]);

  return (
    <>
      <NavigationAnchor id="valintaperusteet" />
      <ListCollapse
        icon="select_all"
        header={t('yleiset.valintaperusteet')}
        actions={
          canCreate ? <Actions organisaatioOid={organisaatioOid} /> : null
        }
        defaultOpen
      >
        <div ref={ref} />

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
