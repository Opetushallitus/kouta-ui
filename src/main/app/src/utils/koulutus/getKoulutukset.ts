const getKoulutukset = async ({ httpClient, apiUrls, organisaatioOid }) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.koulutus-list'),
    { params: { organisaatioOid, myosArkistoidut: false } }
  );

  return data;
};

export default getKoulutukset;
