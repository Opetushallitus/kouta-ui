export const getOppijanumerorekisteriHenkilo = async ({
  httpClient,
  apiUrls,
  oid,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('oppijanumerorekisteri-service.henkilo', oid)
  );

  return data;
};
