const getKoodisto = async ({
  koodistoUri,
  httpClient,
  apiUrls,
  versio = '',
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('koodisto-service.koodi', koodistoUri),
    { params: { koodistoVersio: versio } },
  );

  return data;
};

export default getKoodisto;
