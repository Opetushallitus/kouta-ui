import { HttpClient } from '#/src/httpClient';
import { ApiUrls } from '#/src/urls';

export const getSisaltyyYlakoodit = async ({
  httpClient,
  apiUrls,
  koodiUri,
}: {
  httpClient: HttpClient;
  apiUrls: ApiUrls;
  koodiUri: string;
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.koodisto-koulutukset-by-ylakoodi', '') + koodiUri
  );

  return data;
};

export const GET_SISALTYY_YLAKOODIT_QUERY_KEY = 'getSisaltyyYlakoodit';
