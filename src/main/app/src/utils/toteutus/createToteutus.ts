const createToteutus = async ({ httpClient, apiUrls, toteutus }) => {
  const { data } = await httpClient.put(
    apiUrls.url('kouta-backend.toteutus'),
    toteutus
  );

  return data;
};

export default createToteutus;
