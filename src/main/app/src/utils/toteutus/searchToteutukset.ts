export const searchToteutukset = async ({ httpClient, apiUrls, params }) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.search.toteutukset'),
    {
      params,
      errorNotifier: {
        silent: true,
      },
    }
  );

  return data;
};
