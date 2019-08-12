const getSoraKuvaukset = async ({ httpClient, apiUrls }) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.sora-kuvaus-list'),
  );

  return data;
};

export default getSoraKuvaukset;
