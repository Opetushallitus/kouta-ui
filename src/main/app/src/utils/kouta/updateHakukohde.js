const updateHakukohde = async ({ hakukohde, httpClient, apiUrls }) => {
  const { lastModified = '', ...rest } = hakukohde;

  const headers = {
    'If-Unmodified-Since': lastModified,
  };

  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.hakukohde'),
    rest,
    { headers },
  );

  return data;
};

export default updateHakukohde;
