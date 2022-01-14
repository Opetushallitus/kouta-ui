export const searchHakukohteet = async ({ httpClient, apiUrls, params }) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.search.hakukohteet'),
    {
      params,
      errorNotifier: {
        silent: true,
      },
    }
  );

  return data;
};
