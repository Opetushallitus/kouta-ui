import { HttpClient } from '#/src/httpClient';
import { AmosaaOpetussuunnitelmatResponse } from '#/src/types/domainTypes';
import { ApiUrls } from '#/src/urls';

export const getOpetussuunnitelmat = async ({
  httpClient,
  apiUrls,
  organisaatioOid,
  nimi,
  sivu,
}: {
  httpClient: HttpClient;
  apiUrls: ApiUrls;
  organisaatioOid?: string;
  nimi?: string;
  sivu?: number;
}) => {
  const params: { organisaatio?: string; nimi?: string; sivu?: number } = {
    organisaatio: organisaatioOid,
    nimi,
    sivu,
  };

  const { data } = await httpClient.get<AmosaaOpetussuunnitelmatResponse>(
    apiUrls.url('kouta-backend.eperuste-amosaa-opetussuunnitelmat'),
    { params }
  );
  return data;
};
