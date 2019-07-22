const createValintaperuste = async ({
  httpClient,
  apiUrls,
  valintaperuste,
}) => {
  const { data } = await httpClient.put(
    apiUrls.url('kouta-backend.valintaperuste'),
    valintaperuste,
  );

  return data;
};

export default createValintaperuste;
