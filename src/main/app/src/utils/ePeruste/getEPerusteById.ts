import getEPerusteKuvaus from '#/src/utils/ePeruste/getEPerusteKuvaus';

export const getEPerusteById = async ({ httpClient, apiUrls, ePerusteId }) => {
  if (ePerusteId) {
    const { data } = await httpClient.get(
      apiUrls.url('eperusteet-service.peruste-by-id', ePerusteId)
    );

    const kuvaus = getEPerusteKuvaus(data);
    return data && { ...data, kuvaus };
  }
};
