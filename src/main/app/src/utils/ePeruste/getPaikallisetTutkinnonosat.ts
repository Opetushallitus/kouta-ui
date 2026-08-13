import { HttpClient } from '#/src/httpClient';
import { AmosaaPaikallisetTutkinnonosatResponse } from '#/src/types/domainTypes';
import { ApiUrls } from '#/src/urls';

export const getPaikallisetTutkinnonosat = async ({
  httpClient,
  apiUrls,
  opsId,
}: {
  httpClient: HttpClient;
  apiUrls: ApiUrls;
  opsId: string;
}) => {
  const { data } = await httpClient.get<AmosaaPaikallisetTutkinnonosatResponse>(
    apiUrls.url(
      'kouta-backend.eperuste-amosaa-paikalliset-tutkinnonosat',
      String(opsId)
    )
  );
  return data;
};
