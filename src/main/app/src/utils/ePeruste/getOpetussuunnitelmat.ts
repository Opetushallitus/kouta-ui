import { HttpClient } from '#/src/httpClient';
import { AmosaaOpetussuunnitelmatResponse } from '#/src/types/domainTypes';
import { ApiUrls } from '#/src/urls';

export const getOpetussuunnitelmat = async ({
  httpClient,
  apiUrls,
  organisaatioOid,
  nimi,
}: {
  httpClient: HttpClient;
  apiUrls: ApiUrls;
  organisaatioOid: string;
  nimi?: string;
}) => {
  const params: { organisaatio: string; nimi?: string } = {
    organisaatio: organisaatioOid,
  };
  if (nimi) {
    params.nimi = nimi;
  }
  const { data } = await httpClient.get<AmosaaOpetussuunnitelmatResponse>(
    apiUrls.url('kouta-backend.eperuste-amosaa-opetussuunnitelmat'),
    { params }
  );
  return data;
};
