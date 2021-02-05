const updateOppilaitoksenOsa = async ({
  oppilaitoksenOsa,
  httpClient,
  apiUrls,
}) => {
  const { lastModified = '', ...rest } = oppilaitoksenOsa;

  const headers = {
    'X-If-Unmodified-Since': lastModified,
  };

  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.oppilaitoksenOsa'),
    rest,
    { headers }
  );

  return data;
};

export default updateOppilaitoksenOsa;
