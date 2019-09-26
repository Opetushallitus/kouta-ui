export const getHaut = async ({ organisaatioOid, httpClient, apiUrls }) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.haku-list'),
    {
      params: { organisaatioOid },
    },
  );

  return data;
};

export default getHaut;
