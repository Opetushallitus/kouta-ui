const createOppilaitoksenOsa = async ({
  oppilaitoksenOsa,
  httpClient,
  apiUrls,
}) => {
  const { data } = await httpClient.put(
    apiUrls.url('kouta-backend.oppilaitoksen-osa'),
    oppilaitoksenOsa
  );

  return data;
};

export default createOppilaitoksenOsa;
