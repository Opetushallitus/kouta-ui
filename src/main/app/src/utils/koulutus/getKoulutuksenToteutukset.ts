const getKoulutuksenToteutukset = async ({
  httpClient,
  apiUrls,
  oid,
  organisaatioOid,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.koulutus-toteutukset', oid),
    {
      params: {
        ...(organisaatioOid && { organisaatioOid }),
      },
    }
  );

  return data;
};

export default getKoulutuksenToteutukset;
