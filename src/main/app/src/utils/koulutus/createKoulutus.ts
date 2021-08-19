export const createKoulutus = async ({ httpClient, apiUrls, koulutus }) => {
  const { data } = await httpClient.put(
    apiUrls.url('kouta-backend.koulutus'),
    koulutus
  );

  return data;
};
