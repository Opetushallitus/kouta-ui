const createHaku = async ({ httpClient, apiUrls, haku }) => {
  const { data } = await httpClient.put(
    apiUrls.url('kouta-backend.haku'),
    haku,
  );

  return data;
};

export default createHaku;
