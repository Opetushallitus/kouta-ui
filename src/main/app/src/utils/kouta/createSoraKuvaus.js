const createSoraKuvaus = async ({ httpClient, apiUrls, soraKuvaus }) => {
  const { data } = await httpClient.put(
    apiUrls.url('kouta-backend.sora-kuvaus'),
    soraKuvaus
  );

  return data;
};

export default createSoraKuvaus;
