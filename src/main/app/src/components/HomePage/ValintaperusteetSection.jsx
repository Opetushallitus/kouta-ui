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
import Spin from '../Spin';
import useApiAsync from '../useApiAsync';
import { getKoutaIndexValintaperusteet } from '../../apiUtils';
import { getIndexParamsByFilters } from './utils';
import Filters from './Filters';
import useFilterState from './useFilterState';
import { getFirstLanguageValue, getTestIdProps } from '../../utils';
import Anchor from '../Anchor';
import Button from '../Button';
import ErrorAlert from '../ErrorAlert';
import useTranslation from '../useTranslation';

const getValintaperusteet = async ({ httpClient, apiUrls, ...filters }) => {
  const params = getIndexParamsByFilters(filters);

  const { result, totalCount } = await getKoutaIndexValintaperusteet({
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
    render: ({ nimi, oid }) => (
      <Anchor as={Link} to={`/valintaperusteet/${oid}/muokkaus`}>
        {getFirstLanguageValue(nimi)}
      </Anchor>
    ),
  },
  makeTilaColumn(t),
  makeModifiedColumn(t),
  makeMuokkaajaColumn(t),
];

const ValintaperusteetSection = ({ organisaatioOid }) => {
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
    data: { result: valintaperusteet, pageCount = 0 } = {},
    error,
    reload,
  } = useApiAsync({
    promiseFn: getValintaperusteet,
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
    <ListCollapse
      icon="select_all"
      header={t('yleiset.valintaperusteet')}
      actions={<Actions organisaatioOid={organisaatioOid} />}
      defaultOpen
    >
      <Spacing marginBottom={2}>
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
        <Spin center />
      )}

      <Flex marginTop={2}>
        <Pagination value={page} onChange={setPage} pageCount={pageCount} />
      </Flex>
    </ListCollapse>
  );
};

export default ValintaperusteetSection;
