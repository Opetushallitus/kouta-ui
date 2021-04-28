import { useApiQuery } from '#/src/hooks/useApiQuery';

export const getToteutukset = async ({
  organisaatioOid,
  vainHakukohteeseenLiitettavat,
  httpClient,
  apiUrls,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.toteutus-list'),
    {
      params: {
        organisaatioOid,
        vainHakukohteeseenLiitettavat,
        myosArkistoidut: false,
      },
    }
  );

  return data;
};

export const useToteutukset = (props = {}, options = {}) =>
  useApiQuery('getToteutukset', getToteutukset, props, options);
