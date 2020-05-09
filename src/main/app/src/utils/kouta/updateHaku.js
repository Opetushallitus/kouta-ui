const updateHaku = async ({ haku, httpClient, apiUrls }) => {
  const { lastModified = '', modified, ...rest } = haku;

  const headers = {
    'X-If-Unmodified-Since': lastModified,
  };

  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.haku'),
    rest,
    { headers }
  );

  return data;
};

export default updateHaku;
