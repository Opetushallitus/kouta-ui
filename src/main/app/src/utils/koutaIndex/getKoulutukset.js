import getQueryParams from './getQueryParams';

const getKoulutukset = async ({ httpClient, apiUrls, ...rest }) => {
  const params = getQueryParams(rest);

  const { data } = await httpClient.get(
    apiUrls.url('kouta-index.koulutus-list'),
    { params },
  );

  return data;
};

export default getKoulutukset;
