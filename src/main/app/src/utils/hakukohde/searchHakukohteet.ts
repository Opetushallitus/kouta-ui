import { makeEntitySearch } from '#/src/utils/api/makeEntitySearch';

export const searchHakukohteet = makeEntitySearch(
  'kouta-backend.search.hakukohteet'
);

const ELASTIC_FIND_ALL_SIZE = 5000; // NOTE: there is no magic number for "no limit"

export const searchAllHakukohteet = async ({
  httpClient,
  apiUrls,
  organisaatioOid,
}) => {
  const params = {
    organisaatioOid,
    pageSize: ELASTIC_FIND_ALL_SIZE,
  };
  const data = await searchHakukohteet({ httpClient, apiUrls, params });
  return data?.result;
};
