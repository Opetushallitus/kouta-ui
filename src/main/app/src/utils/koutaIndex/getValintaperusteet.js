import getQueryParams from './getQueryParams';

const getValintaperusteet = async ({ httpClient, apiUrls, ...rest }) => {
  const params = getQueryParams(rest);

  const { data } = await httpClient.get(
    apiUrls.url('kouta-index.valintaperuste-list'),
    {
      params,
    },
  );

  return data;
};

export default getValintaperusteet;
