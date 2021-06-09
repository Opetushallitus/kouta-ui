import getQueryParams from '#/src/utils/api/getQueryParams';

export const searchValintaperusteet = async ({
  httpClient,
  apiUrls,
  ...rest
}) => {
  const params = getQueryParams(rest);

  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.search.valintaperusteet'),
    {
      params,
    }
  );

  return data;
};
