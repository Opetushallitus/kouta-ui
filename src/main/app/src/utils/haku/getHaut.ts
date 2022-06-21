import { useApiQuery } from '#/src/hooks/useApiQuery';

const getHaut = async ({ organisaatioOid, httpClient, apiUrls }) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.haku-list'),
    {
      params: { organisaatioOid, myosArkistoidut: true, yhteishaut: true },
    }
  );

  return data;
};

export const useHaut = (props, options = {}) =>
  useApiQuery('getHaut', getHaut, props, options);

export default getHaut;
