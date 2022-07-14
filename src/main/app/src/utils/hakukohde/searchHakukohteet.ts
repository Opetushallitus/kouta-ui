import {makeEntitySearch, makeFilteredEntitySearch} from '#/src/utils/api/makeEntitySearch';
import {useApiQuery} from "#/src/hooks/useApiQuery";

export const searchHakukohteet = makeEntitySearch(
  'kouta-backend.search.hakukohteet'
);

export const searchFilteredHakukohteet = filterParams => makeFilteredEntitySearch(
    'kouta-backend.search.hakukohteet',
    filterParams
);

export const useFilteredHakukohteet = (filterParams, organisaatioOid) => useApiQuery(
    'search_hakukohde_count',
    searchFilteredHakukohteet(filterParams),
    { params: {organisaatioOid: organisaatioOid } },
    {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
      refetchOnMount: "always"
    }
);

const ELASTIC_FIND_ALL_SIZE = 5000; // NOTE: there is no magic number for "no limit"

export const searchAllHakukohteet = async ({
  httpClient,
  apiUrls,
  organisaatioOid,
}) => {
  const params = {
    organisaatioOid,
    size: ELASTIC_FIND_ALL_SIZE,
  };
  const data = await searchHakukohteet({ httpClient, apiUrls, params });
  return data?.result;
};
