const createHakukohde = async ({ httpClient, apiUrls, hakukohde }) => {
  const { data } = await httpClient.put(
    apiUrls.url('kouta-backend.hakukohde'),
    hakukohde
  );

  return data;
};

export default createHakukohde;
