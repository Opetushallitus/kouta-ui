const getHaut = async ({ organisaatioOid, httpClient, apiUrls }) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.haku-list'),
    {
      params: { organisaatioOid, myosArkistoidut: false },
    }
  );

  return data;
};

export default getHaut;
