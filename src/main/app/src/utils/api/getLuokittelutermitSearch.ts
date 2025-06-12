import { AxiosInstance } from 'axios';

export const getLuokittelutermit = async ({
  httpClient,
  apiUrls,
  searchStr,
  language = 'fi',
  limit = 15,
}: {
  httpClient: AxiosInstance;
  apiUrls: any;
  searchStr: string;
  language: string;
  limit?: number;
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.luokittelutermi-search', searchStr),
    { params: { limit, kieli: language } }
  );

  return data;
};
