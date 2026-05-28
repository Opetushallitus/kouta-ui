import { HttpClient } from '#/src/httpClient';
import { AmosaaOpetussuunnitelma } from '#/src/types/domainTypes';
import { ApiUrls } from '#/src/urls';

export const getOpetussuunnitelmaById = async ({
  httpClient,
  apiUrls,
  opsId,
}: {
  httpClient: HttpClient;
  apiUrls: ApiUrls;
  opsId: string;
}) => {
  const { data } = await httpClient.get<AmosaaOpetussuunnitelma>(
    apiUrls.url(
      'kouta-backend.eperuste-amosaa-opetussuunnitelma',
      String(opsId)
    )
  );
  return data;
};
