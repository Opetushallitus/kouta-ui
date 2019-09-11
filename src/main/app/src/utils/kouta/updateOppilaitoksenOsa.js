const updateOppilaitoksenOsa = async ({
  oppilaitoksenOsa,
  httpClient,
  apiUrls,
}) => {
  const { lastModified = '', ...rest } = oppilaitoksenOsa;

  const headers = {
    'If-Unmodified-Since': lastModified,
  };

  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.oppilaitoksen-osa'),
    rest,
    { headers },
  );

  return data;
};

export default updateOppilaitoksenOsa;
