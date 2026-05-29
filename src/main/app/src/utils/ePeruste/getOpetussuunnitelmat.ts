import { HttpClient } from '#/src/httpClient';
import { AmosaaOpetussuunnitelmatResponse } from '#/src/types/domainTypes';
import { ApiUrls } from '#/src/urls';

export const getOpetussuunnitelmat = async ({
  httpClient,
  apiUrls,
  organisaatioOids,
  nimi,
  sivu,
}: {
  httpClient: HttpClient;
  apiUrls: ApiUrls;
  organisaatioOids?: Array<string>;
  nimi?: string;
  sivu?: number;
}) => {
  const { data } = await httpClient.get<AmosaaOpetussuunnitelmatResponse>(
    apiUrls.url('kouta-backend.eperuste-amosaa-opetussuunnitelmat'),
    {
      params: {
        organisaatiot: organisaatioOids,
        nimi,
        sivu,
        paikallistasisaltoa: true,
      },
    }
  );
  return data;
};
