import getQueryParams from '#/src/utils/api/getQueryParams';

const getHaut = async ({ httpClient, apiUrls, ...rest }) => {
  const params = getQueryParams(rest);

  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.search.haut'),
    {
      params,
    }
  );

  return data;
};

export default getHaut;
