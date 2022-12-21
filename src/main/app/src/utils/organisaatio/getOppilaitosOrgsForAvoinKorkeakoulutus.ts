export const getOppilaitosOrgsForAvoinKorkeakoulutus = async ({
  apiUrls,
  httpClient,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url(
      'kouta-backend.oppilaitos-organisaatiot-for-avoin-korkeakoulutus'
    )
  );

  return data?.organisaatiot || [];
};
