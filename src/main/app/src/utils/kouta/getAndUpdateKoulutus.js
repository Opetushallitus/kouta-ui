import updateKoulutus from './updateKoulutus';
import getKoulutusByOid from './getKoulutusByOid';

const getAndUpdateKoulutus = async ({
  httpClient,
  apiUrls,
  koulutus: koulutusUpdate,
}) => {
  const { oid, ...update } = koulutusUpdate;

  if (!oid) {
    throw Error('Koulutuksella täytyy olla oid');
  }

  const koulutus = await getKoulutusByOid({ oid, httpClient, apiUrls });

  return updateKoulutus({
    httpClient,
    apiUrls,
    koulutus: { ...koulutus, ...update },
  });
};

export default getAndUpdateKoulutus;
