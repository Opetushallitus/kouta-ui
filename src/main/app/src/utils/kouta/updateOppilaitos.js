const updateOppilaitos = async ({ oppilaitos, httpClient, apiUrls }) => {
  const { lastModified = '', ...rest } = oppilaitos;

  const headers = {
    'If-Unmodified-Since': lastModified,
  };

  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.oppilaitos'),
    rest,
    { headers },
  );

  return data;
};

export default updateOppilaitos;
