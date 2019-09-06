const getKoodi = async ({ apiUrls, httpClient, koodi, versio }) => {
  const { data } = await httpClient.get(
    apiUrls.url(
      'koodisto-service.codeelement',
      koodi,
      versio !== undefined ? versio : '',
    ),
  );

  return data;
};

export default getKoodi;
