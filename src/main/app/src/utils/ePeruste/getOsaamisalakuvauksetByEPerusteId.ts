export const getOsaamisalakuvauksetByEPerusteId = async ({
  httpClient,
  apiUrls,
  ePerusteId,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('eperusteet-service.osaamisalakuvaukset', ePerusteId)
  );

  return data?.reformi ?? {};
};
