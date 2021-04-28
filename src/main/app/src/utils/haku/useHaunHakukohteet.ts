import { useApiQuery } from '#/src/hooks/useApiQuery';

const getHaunHakukohteet = async ({
  httpClient,
  apiUrls,
  hakuOid,
  organisaatioOid,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.search.haku', hakuOid),
    {
      params: {
        organisaatioOid,
      },
    }
  );

  return data;
};

export const useHaunHakukohteet = (props = {}, options = {}) =>
  useApiQuery('getHaunHakukohteet', getHaunHakukohteet, props, options);
