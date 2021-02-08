import { useApiQuery } from '#/src/hooks/useApiQuery';
import getHakuByOid from '#/src/utils/haku/getHakuByOid';
import getKoulutustyyppiByKoulutusOid from '#/src/utils/koulutus/getKoulutustyyppiByKoulutusOid';
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

  const { koulutustyyppi } = await (toteutus && toteutus.koulutusOid
    ? getKoulutustyyppiByKoulutusOid({
        oid: toteutus.koulutusOid,
        httpClient,
        apiUrls,
      })
    : null);

  return {
    toteutus,
    haku,
    koulutustyyppi,
    tarjoajat: toteutus?.tarjoajat,
  };
};

export const useHakukohdePageData = (props, options = {}) =>
  useApiQuery('hakukohdePageData', getHakukohdePageData, props, {
    refetchOnWindowFocus: false,
    ...options,
  });
