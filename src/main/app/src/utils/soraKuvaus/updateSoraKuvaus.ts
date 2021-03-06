const updateSoraKuvaus = async ({ httpClient, apiUrls, soraKuvaus }) => {
  const { lastModified = '', ...rest } = soraKuvaus;

  const headers = {
    'X-If-Unmodified-Since': lastModified,
  };

  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.soraKuvaus'),
    rest,
    { headers }
  );

  return data;
};

export default updateSoraKuvaus;
