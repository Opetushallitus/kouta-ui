export const searchValintaperusteet = async ({
  httpClient,
  apiUrls,
  params,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.search.valintaperusteet'),
    {
      params,
      errorNotifier: {
        silent: true,
      },
    }
  );

  return data;
};
