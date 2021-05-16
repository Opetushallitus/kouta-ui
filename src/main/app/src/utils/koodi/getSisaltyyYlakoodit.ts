export const getSisaltyyYlakoodit = async ({
  httpClient,
  apiUrls,
  koodiUri,
}) => {
  if (koodiUri) {
    return httpClient.get(
      apiUrls.url('koodisto-service.sisaltyy-ylakoodit', '') + koodiUri
    );
  } else {
    return httpClient.get(apiUrls.url('koodisto-service.koodi', 'koulutus'));
  }
};

export const GET_SISALTYY_YLAKOODIT_KEY = 'getSisaltyyYlakoodit';
