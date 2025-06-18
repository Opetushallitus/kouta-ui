import { AxiosInstance } from 'axios';

export const getLuokittelutermit = async ({
  httpClient,
  apiUrls,
  searchStr,
  limit = 15,
}: {
  httpClient: AxiosInstance;
  apiUrls: any;
  searchStr: string;
  limit?: number;
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.luokittelutermi-search', searchStr),
    { params: { limit } }
  );

  return data;
};
