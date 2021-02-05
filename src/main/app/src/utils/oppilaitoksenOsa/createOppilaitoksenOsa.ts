const createOppilaitoksenOsa = async ({
  oppilaitoksenOsa,
  httpClient,
  apiUrls,
}) => {
  const { data } = await httpClient.put(
    apiUrls.url('kouta-backend.oppilaitoksenOsa'),
    oppilaitoksenOsa
  );

  return data;
};

export default createOppilaitoksenOsa;
