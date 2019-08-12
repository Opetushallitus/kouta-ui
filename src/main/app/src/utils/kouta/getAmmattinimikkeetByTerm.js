const getAmmattinimikkeetByTerm = async ({
  httpClient,
  apiUrls,
  term,
  limit = 15,
  language = 'fi',
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.ammattinimike-search', term),
    { params: { limit, kieli: language } },
  );

  return data;
};

export default getAmmattinimikkeetByTerm;
