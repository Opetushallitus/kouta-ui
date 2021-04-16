export const getValintaperusteet = async ({
  organisaatioOid,
  hakuOid,
  httpClient,
  apiUrls,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.valintaperuste-list'),
    {
      params: {
        organisaatioOid,
        ...(hakuOid && { hakuOid }),
        myosArkistoidut: false,
      },
    }
  );

  return data;
};

export default getValintaperusteet;
