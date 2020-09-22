export const getEPerusteById = async ({ httpClient, apiUrls, ePerusteId }) => {
  if (ePerusteId) {
    const { data } = await httpClient.get(
      apiUrls.url('eperusteet-service.peruste-by-id', ePerusteId)
    );

    return data;
  }
};
