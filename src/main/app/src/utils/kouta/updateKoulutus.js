const updateKoulutus = async ({ koulutus, httpClient, apiUrls }) => {
  const { lastModified = '', ...rest } = koulutus;

  const headers = {
    'If-Unmodified-Since': lastModified,
  };

  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.koulutus'),
    rest,
    { headers },
  );

  return data;
};

export default updateKoulutus;
