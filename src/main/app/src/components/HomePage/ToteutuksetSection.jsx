import React, { useMemo } from 'react';

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
import { getKoutaIndexToteutukset } from '../../apiUtils';
import { getIndexParamsByFilters } from './utils';
import Filters from './Filters';
import Badge from '../Badge';
import useFilterState from './useFilterState';

import { getFirstLanguageValue } from '../../utils';

const getToteutukset = async ({ httpClient, apiUrls, ...filters }) => {
  const params = getIndexParamsByFilters(filters);

  const { result, totalCount } = await getKoutaIndexToteutukset({
    httpClient,
    apiUrls,
    ...params,
  });

  return { result, pageCount: Math.ceil(totalCount / 10) };
};

const tableColumns = [
  {
    title: 'Nimi',
    key: 'nimi',
    sortable: true,
    render: ({ nimi }) => getFirstLanguageValue(nimi),
  },
  makeTilaColumn(),
  makeModifiedColumn(),
  makeMuokkaajaColumn(),
  {
    title: 'Kiinnitettyjä hakuja',
    key: 'haut',
    render: ({ haut = 0 }) => <Badge color="primary">{haut}</Badge>,
  },
];

const ToteutuksetSection = ({ organisaatioOid }) => {
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

  const { data: { result: toteutukset, pageCount = 0 } = {} } = useApiAsync({
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

  return (
    <ListCollapse icon="settings" header="Koulutuksen toteutukset" defaultOpen>
      <Spacing marginBottom={2}>
        <Filters {...filtersProps} nimiPlaceholder="Hae toteutuksia" />
      </Spacing>

      {rows ? (
        <ListTable
          rows={rows}
          columns={tableColumns}
          onSort={setOrderBy}
          sort={orderBy}
        />
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
