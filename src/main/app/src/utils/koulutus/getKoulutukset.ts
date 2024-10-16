import { useApiQuery } from '#/src/hooks/useApiQuery';

export const getKoulutukset =
  koulutustyyppi =>
  async ({ httpClient, apiUrls, organisaatioOid }) => {
    const { data } = await httpClient.get(
      apiUrls.url('kouta-backend.koulutus-list'),
      {
        params: {
          organisaatioOid,
          ...(koulutustyyppi && { koulutustyyppi }),
          myosArkistoidut: true,
        },
      }
    );

    return data;
  };

export const getKoulutuksetByKoulutustyyppi = async ({
  organisaatioOid,
  koulutustyyppi,
  myosArkistoidut = true,
  httpClient,
  apiUrls,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.koulutus-list'),
    {
      params: {
        organisaatioOid,
        ...(koulutustyyppi && { koulutustyyppi }),
        myosArkistoidut,
      },
    }
  );

  return data;
};

export const useKoulutuksetByKoulutustyyppi = (props = {}, options = {}) => {
  return useApiQuery(
    'getKoulutuksetByKoulutustyyppi',
    getKoulutuksetByKoulutustyyppi,
    props,
    options
  );
};
