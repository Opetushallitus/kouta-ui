const updateValintaperuste = async ({
  valintaperuste,
  httpClient,
  apiUrls,
}) => {
  const { lastModified = '', ...rest } = valintaperuste;

  const headers = {
    'If-Unmodified-Since': lastModified,
  };

  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.valintaperuste'),
    rest,
    { headers },
  );

  return data;
};

export default updateValintaperuste;
