import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import { HttpClient } from '#/src/httpClient';
import { ApiUrls } from '#/src/urls';

export type MuodostumisSaanto = {
  laajuus: {
    minimi: number;
    maksimi?: number;
  };
};

export type OsaamisalaOsa = {
  nimi: TranslatedField<string>;
  muodostumisSaanto?: MuodostumisSaanto;
  osaamisala?: { osaamisalakoodiArvo: string; nimi: TranslatedField<string> };
  osat?: Array<OsaamisalaOsa>;
};

export const getEPerusteRakenne = async ({
  httpClient,
  apiUrls,
  ePerusteId,
}: {
  httpClient: HttpClient;
  apiUrls: ApiUrls;
  ePerusteId: string;
}) => {
  if (ePerusteId) {
    const { data } = await httpClient.get<{ osat: Array<OsaamisalaOsa> }>(
      apiUrls.url('eperusteet-service.peruste-rakenne', ePerusteId)
    );

    return data;
  }
};

export const useEPerusteRakenne = ({ ePerusteId }) =>
  useApiQuery(
    'getEPerusteRakenne',
    getEPerusteRakenne,
    { ePerusteId },
    {
      enabled: Boolean(ePerusteId),
      ...LONG_CACHE_QUERY_OPTIONS,
    }
  );
