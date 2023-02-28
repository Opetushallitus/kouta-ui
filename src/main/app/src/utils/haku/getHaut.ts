import { useApiQuery } from '#/src/hooks/useApiQuery';

const getHaut =
  (yhteishaut = true) =>
  async ({ httpClient, apiUrls, organisaatioOid }) => {
    const { data } = await httpClient.get(
      apiUrls.url('kouta-backend.haku-list'),
      {
        params: {
          organisaatioOid,
          yhteishaut: yhteishaut || false,
          myosArkistoidut: true,
        },
      }
    );

    return data;
  };

export const useHaut = (props, options = {}) =>
  useApiQuery('getHaut', getHaut(), props, options);

export default getHaut;
