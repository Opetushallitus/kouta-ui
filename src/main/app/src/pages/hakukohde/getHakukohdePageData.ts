import { useApiQuery } from '#/src/hooks/useApiQuery';
import getHakuByOid from '#/src/utils/haku/getHakuByOid';
import getToteutusByOid from '#/src/utils/toteutus/getToteutusByOid';

export const getHakukohdePageData = async ({
  hakuOid,
  toteutusOid,
  httpClient,
  apiUrls,
}) => {
  const [toteutus, haku] = await Promise.all([
    getToteutusByOid({ oid: toteutusOid, httpClient, apiUrls }),
    getHakuByOid({ oid: hakuOid, httpClient, apiUrls }),
  ]);

  return {
    toteutus,
    haku,
    koulutustyyppi: toteutus?.metadata?.tyyppi,
    tarjoajat: toteutus?.tarjoajat,
  };
};

export const useHakukohdePageData = (props, options = {}) =>
  useApiQuery('hakukohdePageData', getHakukohdePageData, props, {
    refetchOnWindowFocus: false,
    ...options,
  });
