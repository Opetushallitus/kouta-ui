export const getKoulutukset =
  koulutustyyppi =>
  async ({ httpClient, apiUrls, organisaatioOid }) => {
    const { data } = await httpClient.get(
      apiUrls.url('kouta-backend.koulutus-list'),
      {
        params: {
          organisaatioOid,
          ...(koulutustyyppi && { koulutustyyppi }),
          myosArkistoidut: false,
        },
      }
    );

    return data;
  };
