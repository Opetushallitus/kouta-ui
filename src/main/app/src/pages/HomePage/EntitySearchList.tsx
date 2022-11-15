import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import ListSpin from '#/src/components/ListSpin';
import ListTable from '#/src/components/ListTable';
import Pagination from '#/src/components/Pagination';
import { QueryResultWrapper } from '#/src/components/QueryResultWrapper';
import { Box, Typography, Icon } from '#/src/components/virkailija';
import { ENTITY } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import { getTestIdProps } from '#/src/utils';
import {
  getSearchQueryParams,
  FILTER_PAGE_SIZE,
} from '#/src/utils/api/getSearchQueryParams';

import Filters from './Filters';
import { getIndexParamsByFilters } from './utils';

export const useEntitySearch = ({
  filtersProps,
  organisaatioOid,
  searchEntities,
  searchPage,
}) => {
  const queryParams = useMemo(
    () =>
      getSearchQueryParams(
        getIndexParamsByFilters({ ...filtersProps, organisaatioOid })
      ),
    [filtersProps, organisaatioOid]
  );

  return useApiQuery(
    'search.' + searchPage,
    searchEntities,
    { params: queryParams },
    {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
      refetchOnMount: 'always',
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
  filterState: any;
  searchPage: string;
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

const IconCircle = styled(Icon)`
  display: block;
  background-color: ${({ theme }) => theme.colors.grayLighten5};
  width: 56px;
  height: 56px;
  line-height: 56px;
  border-radius: 28px;
`;

const NoResults = styled(Box).attrs({ margin: 3 })`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
`;

export const EntitySearchList = ({
  organisaatioOid,
  entityType,
  searchEntities,
  nimiPlaceholder,
  ActionBar,
  columns,
  filterState,
  searchPage,
}: EntitySearchListProps) => {
  const { setPage, setOrderBy, filtersProps, state } = filterState;

  const entityState = state.context[entityType];
  const queryResult = useEntitySearch({
    filtersProps: entityState,
    organisaatioOid,
    searchEntities,
    searchPage,
  });
  const { t } = useTranslation();

  const { result: entities, totalCount } = queryResult?.data ?? {};

  const pageCount = useMemo(
    () => (totalCount ? Math.ceil(totalCount / FILTER_PAGE_SIZE) : 0),
    [totalCount]
  );

  const isEmptyResult = entities?.length === 0;

  return (
    <Box display="flex" flexDirection="column">
      <Box marginBottom={2}>
        <Filters {...filtersProps} nimiPlaceholder={nimiPlaceholder} />
      </Box>
      <Box marginBottom={2}>
        <QueryResultWrapper queryResult={queryResult} LoadingWrapper={ListSpin}>
          {isEmptyResult ? (
            <NoResults>
              <Typography>
                <Box mb={2} display="flex" justifyContent="center">
                  <IconCircle type="folder" />
                </Box>
                {t('etusivu.eiTuloksia')}
              </Typography>
            </NoResults>
          ) : (
            <>
              {ActionBar && (
                <Box marginBottom={2}>
                  <ActionBar />
                </Box>
              )}
              <EntityListTable
                entities={entities}
                columns={columns}
                onSort={setOrderBy}
                sort={entityState.orderBy}
                {...getTestIdProps(`${entityType}Table`)}
              />
            </>
          )}
        </QueryResultWrapper>
      </Box>
      <Box display="flex" justifyContent="center">
        <Pagination
          value={entityState.page}
          onChange={setPage}
          pageCount={pageCount}
        />
      </Box>
    </Box>
  );
};
