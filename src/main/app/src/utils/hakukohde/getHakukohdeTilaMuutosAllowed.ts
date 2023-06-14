export const getHakukohdeTilaMuutosAllowed = async ({
  oid,
  status,
  httpClient,
  apiUrls,
}) => {
  const url = apiUrls.url(
    'kouta-backend.hakukohde-tilamuutos-allowed',
    oid,
    status
  );
  const { data } = await httpClient.get(url);
  return data;
};

export default getHakukohdeTilaMuutosAllowed;
