export const getSisaltyyYlakoodit = async ({
  httpClient,
  apiUrls,
  koodiUri,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('koodisto-service.sisaltyy-ylakoodit', '') + koodiUri
  );

  return data;
};

export const GET_SISALTYY_YLAKOODIT_QUERY_KEY = 'getSisaltyyYlakoodit';
