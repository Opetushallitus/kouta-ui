import zipObject from 'lodash/zipObject';
import get from 'lodash/get';

import { isString, isArray } from '../index';
import parseKoodiUri from '../parseKoodiUri';
import getKoodisto from '../koodistoService/getKoodisto';
import getKoodiNimiTranslation from '../getKoodiNimiTranslation';
import isEmpty from '../isEmpty';

const resolveToteutusNimi = async ({ httpClient, apiUrls, toteutus }) => {
  if (!isEmpty(toteutus.nimi)) {
    return toteutus.nimi;
  }

  const { kielivalinta } = toteutus;
  const lukiolinjaKoodiUri = get(toteutus, 'metadata.lukiolinjaKoodiUri');

  if (isString(lukiolinjaKoodiUri) && isArray(kielivalinta)) {
    const { koodisto, versio, koodi } = parseKoodiUri(lukiolinjaKoodiUri);

    const koodistoKoodit = await getKoodisto({
      httpClient,
      apiUrls,
      koodistoUri: koodisto,
      koodistoVersio: versio,
    });

    const targetKoodi = isArray(koodistoKoodit)
      ? koodistoKoodit.find(k => k.koodiUri === koodi)
      : undefined;

    return targetKoodi
      ? zipObject(
          kielivalinta,
          kielivalinta.map(k => getKoodiNimiTranslation(targetKoodi, k)),
        )
      : {};
  }

  return {};
};

const createToteutus = async ({ httpClient, apiUrls, toteutus }) => {
  let toteutusData = { ...toteutus };

  const nimi = await resolveToteutusNimi({ httpClient, apiUrls, toteutus });

  toteutusData = { ...toteutusData, nimi };

  const { data } = await httpClient.put(
    apiUrls.url('kouta-backend.toteutus'),
    toteutusData,
  );

  return data;
};

export default createToteutus;
