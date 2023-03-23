const getHakemuspalveluHakukohdeInfo = async ({
  hakukohdeOid,
  httpClient,
  apiUrls,
}) => {
  const url = apiUrls.url(
    'kouta-backend.hakemuspalvelu-hakukohde-info',
    hakukohdeOid
  );
  const { data } = await httpClient.get(url);

  return data;
};

export default getHakemuspalveluHakukohdeInfo;
