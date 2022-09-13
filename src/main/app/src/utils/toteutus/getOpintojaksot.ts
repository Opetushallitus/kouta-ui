import { useApiQuery } from '#/src/hooks/useApiQuery';

export const getOpintojaksot = async ({
  organisaatioOid,
  httpClient,
  apiUrls,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.toteutus-opintojaksot'),
    {
      params: {
        organisaatioOid,
      },
    }
  );

  return data;
};

export const useOpintojaksot = (props = {}, options = {}) =>
  useApiQuery('getOpintojaksot', getOpintojaksot, props, options);
