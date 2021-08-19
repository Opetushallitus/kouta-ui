export const updateKoulutus = async ({ koulutus, httpClient, apiUrls }) => {
  const { lastModified = '', ...restKoulutus } = koulutus;

  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.koulutus'),
    restKoulutus,
    {
      headers: {
        'X-If-Unmodified-Since': lastModified,
      },
    }
  );

  return data;
};
