export const getHakemuspalveluLomakkeet = async ({ httpClient, apiUrls }) => {
  const { data } = await httpClient.get(
    apiUrls.url('lomake-editori.lomakkeet')
  );

  return data?.forms ?? [];
};
