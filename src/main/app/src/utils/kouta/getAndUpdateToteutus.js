import getToteutusByOid from './getToteutusByOid';
import updateToteutus from './updateToteutus';

const getAndUpdateToteutus = async ({
  httpClient,
  apiUrls,
  toteutus: toteutusUpdate,
}) => {
  const { oid, ...update } = toteutusUpdate;

  if (!oid) {
    throw new Error('Toteutuksella täytyy olla oid');
  }

  const toteutus = await getToteutusByOid({ oid, httpClient, apiUrls });

  return updateToteutus({
    httpClient,
    apiUrls,
    toteutus: { ...toteutus, ...update },
  });
};

export default getAndUpdateToteutus;
