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
      versio !== undefined ? versio : '',
    ),
    {
      errorNotifier: {
        silent,
      },
    },
  );

  return data;
};

export default getKoodi;
