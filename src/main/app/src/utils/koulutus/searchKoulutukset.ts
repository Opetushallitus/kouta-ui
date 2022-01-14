import { useApiQuery } from '#/src/hooks/useApiQuery';

export { FILTER_PAGE_SIZE } from '#/src/utils/api/getSearchQueryParams';

export const searchKoulutukset = async ({ params, httpClient, apiUrls }) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.search.koulutukset'),
    {
      params,
      errorNotifier: {
        silent: true,
      },
    }
  );

  return data;
};

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
