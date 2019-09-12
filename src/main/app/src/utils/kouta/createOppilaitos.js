const createOppilaitos = async ({ oppilaitos, httpClient, apiUrls }) => {
  const { data } = await httpClient.put(
    apiUrls.url('kouta-backend.oppilaitos'),
    oppilaitos,
  );

  return data;
};

export default createOppilaitos;
