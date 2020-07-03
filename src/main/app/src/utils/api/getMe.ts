export const getMe = async ({ httpClient, apiUrls }) => {
  const { data } = await httpClient.get(apiUrls.url('kayttooikeus-service.me'));

  return data;
};
