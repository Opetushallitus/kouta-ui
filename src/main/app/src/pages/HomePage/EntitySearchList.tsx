import React, { useMemo } from 'react';

import _fp from 'lodash/fp';

import ListSpin from '#/src/components/ListSpin';
import ListTable from '#/src/components/ListTable';
import Pagination from '#/src/components/Pagination';
import { QueryResultWrapper } from '#/src/components/QueryResultWrapper';
import { Box } from '#/src/components/virkailija';
import { ENTITY } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import { getTestIdProps } from '#/src/utils';
import {
  getSearchQueryParams,
  FILTER_PAGE_SIZE,
} from '#/src/utils/api/getSearchQueryParams';

import Filters from './Filters';
import { useFilterState } from './useFilterState';
import { getIndexParamsByFilters } from './utils';

export const useEntitySearch = ({
  filterState,
  organisaatioOid,
  entityType,
  searchEntities,
}) => {
  const queryParams = useMemo(
    () =>
      getSearchQueryParams(
        getIndexParamsByFilters({ ...filterState, organisaatioOid })
      ),
    [filterState, organisaatioOid]
  );

  return useApiQuery(
    'search' + _fp.capitalize(entityType),
    searchEntities,
    { params: queryParams },
    {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    }
  );
};

type ListTableColumnSpec = {
  title?: string | ((x: any) => React.ReactNode);
  key: string;
  sortable?: boolean;
  render?: (props: any) => React.ReactNode;
  Component?: React.ComponentType<any>;
};

type EntitySearchListProps = {
  organisaatioOid: string;
  entityType: ENTITY;
  searchEntities: (props: any) => any;
  nimiPlaceholder: string;
  columns: Array<ListTableColumnSpec>;
  ActionBar?: React.ComponentType<any>;
};

export const EntityListTable = ({ entities, ...rest }) => {
  const rows = useMemo(
    () =>
      _fp.map(
        entityData => ({
          ...entityData,
          key: entityData?.oid ?? entityData?.id,
        }),
        entities
      ),
    [entities]
  );
  return <ListTable rows={rows} {...rest} />;
};

export const EntitySearchList = ({
  organisaatioOid,
  entityType,
  searchEntities,
  nimiPlaceholder,
  ActionBar,
  columns,
}: EntitySearchListProps) => {
  const filterState = useFilterState(entityType);
  const { page, setPage, orderBy, setOrderBy, filtersProps } = filterState;

  const queryResult = useEntitySearch({
    filterState,
    organisaatioOid,
    searchEntities,
    entityType,
  });

  const { result: entities, totalCount } = queryResult?.data ?? {};

  const pageCount = useMemo(
    () => (totalCount ? Math.ceil(totalCount / FILTER_PAGE_SIZE) : 0),
    [totalCount]
  );

  return (
    <Box display="flex" flexDirection="column">
      <Box marginBottom={2}>
        <Filters {...filtersProps} nimiPlaceholder={nimiPlaceholder} />
      </Box>
      {ActionBar && (
        <Box marginBottom={2}>
          <ActionBar />
        </Box>
      )}
      <Box marginBottom={2}>
        <QueryResultWrapper queryResult={queryResult} LoadingWrapper={ListSpin}>
          <EntityListTable
            entities={entities}
            columns={columns}
            onSort={setOrderBy}
            sort={orderBy}
            {...getTestIdProps(`${entityType}Table`)}
          />
        </QueryResultWrapper>
      </Box>
      <Box display="flex" justifyContent="center">
        <Pagination value={page} onChange={setPage} pageCount={pageCount} />
      </Box>
    </Box>
  );
};
