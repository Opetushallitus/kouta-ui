const login = async ({ httpClient, apiUrls }) => {
  const { data } = await httpClient.get(apiUrls.url('kouta-backend.login'));

  return data;
};

export default login;
