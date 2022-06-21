import { useApiQuery } from '#/src/hooks/useApiQuery';

const getHaut = async ({ organisaatioOid, httpClient, apiUrls, yhteishaut = true }) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.haku-list'),
    {
      params: { organisaatioOid, myosArkistoidut: true, yhteishaut },
    }
  );

  return data;
};

export const useHaut = (props, options = {}) =>
  useApiQuery('getHaut', getHaut, props, options);

export default getHaut;
