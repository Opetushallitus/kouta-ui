import _ from 'lodash';

import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';
import getKoodisto from '#/src/utils/koodi/getKoodisto';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';

const resolveToteutusNimi = async ({ httpClient, apiUrls, toteutus }) => {
  if (!_.isEmpty(toteutus.nimi)) {
    return toteutus.nimi;
  }

  const { kielivalinta } = toteutus;
  const lukiolinjaKoodiUri = _.get(toteutus, 'metadata.lukiolinjaKoodiUri');

  if (_.isString(lukiolinjaKoodiUri) && _.isArray(kielivalinta)) {
    const { koodisto, koodi } = parseKoodiUri(lukiolinjaKoodiUri);

    const koodistoKoodit = await getKoodisto({
      httpClient,
      apiUrls,
      koodistoUri: koodisto,
    });

    const targetKoodi = _.isArray(koodistoKoodit)
      ? koodistoKoodit.find(k => k.koodiUri === koodi)
      : undefined;

    return targetKoodi
      ? _.zipObject(
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
