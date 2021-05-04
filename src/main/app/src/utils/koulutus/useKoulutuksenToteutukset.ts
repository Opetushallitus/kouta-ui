import { useApiQuery } from '#/src/hooks/useApiQuery';

const getKoulutuksenToteutukset = async ({
  httpClient,
  apiUrls,
  koulutusOid,
  organisaatioOid,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.search.koulutus', koulutusOid),
    {
      params: {
        organisaatioOid,
      },
    }
  );

  return data;
};

export const useKoulutuksenToteutukset = (props = {}, options = {}) =>
  useApiQuery(
    'getKoulutuksenToteutukset',
    getKoulutuksenToteutukset,
    props,
    options
  );
