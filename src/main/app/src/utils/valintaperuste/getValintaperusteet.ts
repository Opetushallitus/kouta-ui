import { useApiQuery } from '#/src/hooks/useApiQuery';

export const getValintaperusteet = async ({
  organisaatioOid,
  hakuOid,
  koulutustyyppi,
  httpClient,
  apiUrls,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.valintaperuste-list'),
    {
      params: {
        organisaatioOid,
        ...(hakuOid && { hakuOid }),
        ...(koulutustyyppi && { koulutustyyppi }),
        myosArkistoidut: false,
      },
    }
  );

  return data;
};

export const useValintaperusteet = ({
  organisaatioOid,
  hakuOid,
  koulutustyyppi,
}) =>
  useApiQuery('getValintaperusteet', getValintaperusteet, {
    organisaatioOid,
    hakuOid,
    koulutustyyppi,
  });
