import { type HttpClient } from '#/src/httpClient';
import { type ApiUrls } from '#/src/urls';

export const getLuokittelutermit = async ({
  httpClient,
  apiUrls,
  searchStr,
  limit = 15,
}: {
  httpClient: HttpClient;
  apiUrls: ApiUrls;
  searchStr: string;
  limit?: number;
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.luokittelutermi-search', searchStr),
    { params: { limit } }
  );

  return data;
};
