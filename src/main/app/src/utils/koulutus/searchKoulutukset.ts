import { useApiQuery } from '#/src/hooks/useApiQuery';
import { makeEntitySearch } from '#/src/utils/api/makeEntitySearch';
export { FILTER_PAGE_SIZE } from '#/src/utils/api/getSearchQueryParams';

export const searchKoulutukset = makeEntitySearch(
  'kouta-backend.search.koulutukset'
);

const ELASTIC_FIND_ALL_SIZE = 5000; // NOTE: there is no magic number for "no limit"

export const useSearchAllKoulutuksetWithOid = ({ organisaatioOid }) => {
  const params = {
    organisaatioOid,
    size: ELASTIC_FIND_ALL_SIZE,
  };

  return useApiQuery(
    'searchKoulutuksetWithOid',
    searchKoulutukset,
    { params },
    {
      refetchOnWindowFocus: false,
    }
  );
};
