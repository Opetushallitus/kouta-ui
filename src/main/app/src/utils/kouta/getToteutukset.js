const getToteutukset = async ({ organisaatioOid, httpClient, apiUrls }) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.toteutus-list'),
    {
      params: { organisaatioOid },
    }
  );

  return data;
};

export default getToteutukset;
