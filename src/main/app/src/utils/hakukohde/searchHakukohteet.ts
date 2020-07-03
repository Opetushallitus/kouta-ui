import getQueryParams from '#/src/utils/api/getQueryParams';

const getHakukohteet = async ({ httpClient, apiUrls, ...rest }) => {
  const params = getQueryParams(rest);

  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.search.hakukohteet'),
    {
      params,
    }
  );

  return data;
};

export default getHakukohteet;
