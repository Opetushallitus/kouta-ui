const getToteutukset = async ({
  organisaatioOid,
  vainHakukohteeseenLiitettavat,
  httpClient,
  apiUrls,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.toteutus-list'),
    {
      params: {
        organisaatioOid,
        vainHakukohteeseenLiitettavat,
        myosArkistoidut: false,
      },
    }
  );

  return data;
};

export default getToteutukset;
