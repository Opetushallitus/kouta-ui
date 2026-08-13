import { ENTITY } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import { HttpClient } from '#/src/httpClient';
import { ApiUrls } from '#/src/urls';
import { getEntityByOid } from '#/src/utils/api/getEntityByOid';

export const getHakukohdePageData = async ({
  hakuOid,
  toteutusOid,
  httpClient,
  apiUrls,
}: {
  hakuOid: string;
  toteutusOid: string;
  httpClient: HttpClient;
  apiUrls: ApiUrls;
}) => {
  const [toteutus, haku] = await Promise.all([
    getEntityByOid({
      entityType: ENTITY.TOTEUTUS,
      oid: toteutusOid,
      httpClient,
      apiUrls,
    }),
    getEntityByOid({
      entityType: ENTITY.HAKU,
      oid: hakuOid,
      httpClient,
      apiUrls,
    }),
  ]);

  return {
    toteutus,
    haku,
    koulutustyyppi: toteutus?.metadata?.tyyppi,
  };
};

export const useHakukohdePageData = (props, options = {}) =>
  useApiQuery('hakukohdePageData', getHakukohdePageData, props, {
    refetchOnWindowFocus: false,
    ...options,
  });
