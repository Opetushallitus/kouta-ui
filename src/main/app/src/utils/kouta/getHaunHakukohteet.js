const getHaunHakukohteet = async ({
  httpClient,
  apiUrls,
  organisaatioOid,
  oid,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.haku-hakukohteet', oid),
    {
      params: { organisaatioOid },
    }
  );

  return data;
};

export default getHaunHakukohteet;
