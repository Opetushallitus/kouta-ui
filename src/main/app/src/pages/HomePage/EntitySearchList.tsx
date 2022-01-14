import React, { useEffect, useMemo, useState } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import ListSpin from '#/src/components/ListSpin';
import ListTable from '#/src/components/ListTable';
import Pagination from '#/src/components/Pagination';
import { QueryResultWrapper } from '#/src/components/QueryResultWrapper';
import { Box } from '#/src/components/virkailija';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import { getTestIdProps } from '#/src/utils';
import {
  getSearchQueryParams,
  FILTER_PAGE_SIZE,
} from '#/src/utils/api/getSearchQueryParams';

import Filters from './Filters';
import { useFilterState } from './useFilterState';
import { getIndexParamsByFilters } from './utils';

export const EntitySearchList = ({
  organisaatioOid,
  entityType,
  searchEntities,
  makeTableColumns,
  nimiPlaceholder,
}) => {
  const { t } = useTranslation();

  const filterState = useFilterState(entityType);
  const { page, setPage, orderBy, setOrderBy, filtersProps } = filterState;

  const queryParams = useMemo(
    () =>
      getSearchQueryParams(
        getIndexParamsByFilters({ ...filterState, organisaatioOid })
      ),
    [filterState, organisaatioOid]
  );

  const queryResult = useApiQuery(
    'search' + _fp.capitalize(entityType),
    searchEntities,
    { params: queryParams },
    {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    }
  );

  const { result: entities, totalCount } = queryResult?.data ?? {};

  const [pageCount, setPageCount] = useState(0);
  useEffect(() => {
    if (totalCount !== undefined) {
      setPageCount(Math.ceil(totalCount / FILTER_PAGE_SIZE));
    }
  }, [totalCount]);

  const rows = useMemo(() => {
    return entities
      ? entities.map(entityData => ({
          ...entityData,
          key: entityData?.oid ?? entityData?.id,
        }))
      : null;
  }, [entities]);

  const tableColumns = useMemo(
    () => makeTableColumns(t, organisaatioOid),
    [makeTableColumns, t, organisaatioOid]
  );

  return (
    <>
      <Box mb={3}>
        <Filters {...filtersProps} nimiPlaceholder={nimiPlaceholder} />
      </Box>
      <QueryResultWrapper queryResult={queryResult} LoadingWrapper={ListSpin}>
        <ListTable
          rows={rows}
          columns={tableColumns}
          onSort={setOrderBy}
          sort={orderBy}
          {...getTestIdProps(`${entityType}Table`)}
        />
      </QueryResultWrapper>
      <Box mt={3} display="flex" marginTop={3} justifyContent="center">
        <Pagination value={page} onChange={setPage} pageCount={pageCount} />
      </Box>
    </>
  );
};
