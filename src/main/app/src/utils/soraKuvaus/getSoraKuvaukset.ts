const getSoraKuvaukset = async ({ httpClient, apiUrls, organisaatioOid }) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.soraKuvaus-list'),
    { params: { organisaatioOid, myosArkistoidut: false } }
  );

  return data;
};

export default getSoraKuvaukset;
