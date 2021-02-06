import _ from 'lodash';

const getKoodi = async ({
  apiUrls,
  httpClient,
  koodi,
  versio,
  silent = false,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url(
      'koodisto-service.codeelement',
      koodi,
      !_.isNil(versio) ? versio : ''
    ),
    {
      errorNotifier: {
        silent,
      },
    }
  );

  return data;
};

export default getKoodi;
