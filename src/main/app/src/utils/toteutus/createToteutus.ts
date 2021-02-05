import { get, isString, isArray, isEmpty, zipObject } from 'lodash';

import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';
import getKoodisto from '#/src/utils/koodi/getKoodisto';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';

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
          kielivalinta.map(k => getKoodiNimiTranslation(targetKoodi, k))
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
    toteutusData
  );

  return data;
};

export default createToteutus;
