import { useApiQuery } from '#/src/hooks/useApiQuery';
import { getQueryParams } from '#/src/utils/api/getQueryParams';

export { FILTER_PAGE_SIZE } from '#/src/utils/api/getQueryParams';

export const useSearchKoulutukset = props => {
  const params = getQueryParams(props);

  return useApiQuery(
    'searchKoulutukset',
    getSearchKoulutuksetData,
    { params },
    {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    }
  );
};

const getSearchKoulutuksetData = async ({ params, httpClient, apiUrls }) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.search.koulutukset'),
    { params }
  );

  return data;
};

export default getSearchKoulutuksetData;

const ELASTIC_FIND_ALL_SIZE = 5000; // NOTE: there is no magic number for "no limit"

export const useSearchAllKoulutuksetWithOid = ({ organisaatioOid }) => {
  const params = {
    organisaatioOid,
    size: ELASTIC_FIND_ALL_SIZE,
  };

  return useApiQuery(
    'searchKoulutuksetWithOid',
    getSearchKoulutuksetData,
    { params },
    {
      refetchOnWindowFocus: false,
    }
  );
};
