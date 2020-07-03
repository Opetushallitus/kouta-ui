const isNullish = value => value === undefined || value === null;

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
      !isNullish(versio) ? versio : ''
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
