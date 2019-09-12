const updateToteutus = async ({ toteutus, httpClient, apiUrls }) => {
  const { lastModified = '', ...rest } = toteutus;

  const headers = {
    'X-If-Unmodified-Since': lastModified,
  };

  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.toteutus'),
    rest,
    { headers },
  );

  return data;
};

export default updateToteutus;
