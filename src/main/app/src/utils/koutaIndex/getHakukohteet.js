import getQueryParams from './getQueryParams';

const getHakukohteet = async ({ httpClient, apiUrls, ...rest }) => {
  const params = getQueryParams(rest);

  const { data } = await httpClient.get(
    apiUrls.url('kouta-index.hakukohde-list'),
    {
      params,
    },
  );

  return data;
};

export default getHakukohteet;
