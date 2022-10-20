import { useApiQuery } from '#/src/hooks/useApiQuery';
import {
  makeEntitySearch,
  makeFilteredEntitySearch,
} from '#/src/utils/api/makeEntitySearch';

export const searchToteutukset = makeEntitySearch(
  'kouta-backend.search.toteutukset'
);

export const searchFilteredToteutukset = filterParams =>
  makeFilteredEntitySearch('kouta-backend.search.toteutukset', filterParams);

export const useFilteredToteutukset = (filterParams, organisaatioOid) => {
  return useApiQuery(
    'search_toteutus_count',
    searchFilteredToteutukset(filterParams),
    { params: { organisaatioOid: organisaatioOid } },
    {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
      refetchOnMount: 'always',
    }
  );
};
