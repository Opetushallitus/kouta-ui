import { isEmpty } from 'lodash-es';

import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { HttpClient } from '#/src/httpClient';
import { AmosaaOpetussuunnitelmatResponse } from '#/src/types/domainTypes';
import { ApiUrls } from '#/src/urls';

export const getOpetussuunnitelmat = async ({
  httpClient,
  apiUrls,
  organisaatioOids = [],
  nimi,
  sivu,
  kieli,
}: {
  httpClient: HttpClient;
  apiUrls: ApiUrls;
  organisaatioOids: Array<string>;
  kieli: LanguageCode;
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
        kieli,
        paikallistasisaltoa: true,
      },
    }
  );
  return data;
};

export const useQueryOptionsGetOpetussuunnitelmat = ({
  organisaatioOids,
  nimi,
  kieli,
}: {
  organisaatioOids: Array<string>;
  nimi?: string;
  kieli: LanguageCode;
}) => {
  const httpClient = useHttpClient();
  const apiUrls = useUrls();
  return {
    queryKey: ['getOpetussuunnitelmat', organisaatioOids, nimi, kieli],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getOpetussuunnitelmat({
        httpClient,
        apiUrls,
        organisaatioOids,
        nimi,
        sivu: pageParam,
        kieli,
      }),
    initialPageParam: 0,
    gcTime: 30000,
    staleTime: 30000,
    getNextPageParam: lastPage =>
      lastPage.sivu != null &&
      lastPage.sivuja != null &&
      lastPage.sivu < lastPage.sivuja
        ? lastPage.sivu + 1
        : undefined,
  };
};
