import getQueryParams from './getQueryParams';

const getToteutukset = async ({ httpClient, apiUrls, ...rest }) => {
  const params = getQueryParams(rest);

  const { data } = await httpClient.get(
    apiUrls.url('kouta-index.toteutus-list'),
    { params },
  );

  return data;
};

export default getToteutukset;
