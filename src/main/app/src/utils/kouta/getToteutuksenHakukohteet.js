export const getToteutuksenHakukohteet = async ({
  httpClient,
  apiUrls,
  oid,
  organisaatioOid,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.toteutus-hakukohteet', oid),
    {
      params: {
        ...(organisaatioOid && { organisaatioOid }),
      },
    },
  );

  return data;
};

export default getToteutuksenHakukohteet;
