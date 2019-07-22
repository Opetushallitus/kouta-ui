const updateSoraKuvaus = async ({ httpClient, apiUrls, soraKuvaus }) => {
  const { lastModified = '', ...rest } = soraKuvaus;

  const headers = {
    'If-Unmodified-Since': lastModified,
  };

  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.sora-kuvaus'),
    rest,
    { headers },
  );

  return data;
};

export default updateSoraKuvaus;
