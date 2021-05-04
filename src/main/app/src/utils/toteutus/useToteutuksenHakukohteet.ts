import { useApiQuery } from '#/src/hooks/useApiQuery';

const getToteutuksenHakukohteet = async ({
  httpClient,
  apiUrls,
  toteutusOid,
  organisaatioOid,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.search.toteutus', toteutusOid),
    {
      params: {
        organisaatioOid,
      },
    }
  );

  return data;
};

export const useToteutuksenHakukohteet = (props = {}, options = {}) =>
  useApiQuery(
    'getToteutuksenHakukohteet',
    getToteutuksenHakukohteet,
    props,
    options
  );
