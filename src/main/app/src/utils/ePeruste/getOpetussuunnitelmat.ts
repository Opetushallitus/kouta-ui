import { isEmpty } from 'lodash';

import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';
import { HttpClient } from '#/src/httpClient';
import { AmosaaOpetussuunnitelmatResponse } from '#/src/types/domainTypes';
import { ApiUrls } from '#/src/urls';

export const getOpetussuunnitelmat = async ({
  httpClient,
  apiUrls,
  organisaatioOids = [S],
  nimi,
  sivu,
}: {
  httpClient: HttpClient;
  apiUrls: ApiUrls;
  organisaatioOids: Array<string>;
  nimi?: string;
  sivu?: number;
}) => {
  // Ei turhaan yritetä hakea, jos ei annettu yhtään organisaatiota
  if (isEmpty(organisaatioOids)) {
    return [] as AmosaaOpetussuunnitelmatResponse;
  }

  const { data } = await httpClient.get<AmosaaOpetussuunnitelmatResponse>(
    apiUrls.url('kouta-backend.eperuste-amosaa-opetussuunnitelmat'),
    {
      params: {
        // Jos OPH-virkailija, ei rajata organisaatioilla lainkaan
        organisaatiot: organisaatioOids?.includes(
          OPETUSHALLITUS_ORGANISAATIO_OID
        )
          ? undefined
          : organisaatioOids,
        nimi,
        sivu,
        paikallistasisaltoa: true,
      },
    }
  );
  return data;
};
