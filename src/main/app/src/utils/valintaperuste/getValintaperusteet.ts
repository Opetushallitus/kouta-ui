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
