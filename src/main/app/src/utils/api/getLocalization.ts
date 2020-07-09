import _ from 'lodash/fp';

export const getLocalization = async ({
  category = 'kouta',
  locale = '',
  httpClient,
  apiUrls,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('lokalisaatio-service.localisation', category),
    {
      params: { locale },
    }
  );

  let resource = {};

  // eslint-disable-next-line
  for (const translation of data) {
    const lng = translation.locale.toLowerCase();
    const { key, value } = translation;

    if (lng === locale && key && value) {
      _.set(key, value, resource);
    }
  }

  return resource;
};
