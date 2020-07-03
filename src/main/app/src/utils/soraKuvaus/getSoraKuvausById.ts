import { get, isObject } from 'lodash';

export const getSoraKuvausById = async ({ httpClient, apiUrls, id }) => {
  const { data, headers } = await httpClient.get(
    apiUrls.url('kouta-backend.sora-kuvaus-by-id', id)
  );

  const lastModified = get(headers, 'x-last-modified') || null;

  return isObject(data) ? { lastModified, ...data } : data;
};

export default getSoraKuvausById;
