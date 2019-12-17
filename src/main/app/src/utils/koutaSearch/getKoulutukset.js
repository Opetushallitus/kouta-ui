import getQueryParams from './getQueryParams';

const getKoulutukset = async ({ httpClient, apiUrls, ...rest }) => {
  const params = getQueryParams(rest);

  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.search.koulutukset'),
    { params },
  );

  return data;
};

export default getKoulutukset;
