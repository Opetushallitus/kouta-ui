export const searchHaut = async ({ httpClient, apiUrls, params }) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.search.haut'),
    {
      params,
      errorNotifier: {
        silent: true,
      },
    }
  );

  return data;
};

export default searchHaut;
