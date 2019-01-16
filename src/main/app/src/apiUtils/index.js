import { KOULUTUSTYYPPI_CATEGORY_TO_KOULUTUSTYYPPI_IDS_MAP } from '../constants';
import { isArray } from '../utils';
import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import toPairs from 'lodash/toPairs';
import maxBy from 'lodash/maxBy';

const getKoodiUriParts = uri => {
  const [koodiUri, versio = null] = uri.split('#');

  return {
    koodiUri,
    versio,
  };
};

export const getKoulutuksetByKoulutusTyyppi = async ({
  httpClient,
  apiUrls,
  koulutusTyyppi,
}) => {
  const ids = KOULUTUSTYYPPI_CATEGORY_TO_KOULUTUSTYYPPI_IDS_MAP[koulutusTyyppi];

  if (!ids) {
    return [];
  }

  const responses = await Promise.all(
    ids.map(id =>
      httpClient.get(apiUrls.url('koodisto-service.sisaltyy-ylakoodit', id)),
    ),
  );

  const koulutukset = responses.reduce((acc, response) => {
    const { data } = response;

    if (!isArray(data)) {
      return acc;
    }

    return [
      ...acc,
      ...data.map(({ metadata, koodisto, koodiArvo, koodiUri, versio }) => ({
        metadata,
        koodisto,
        koodiArvo,
        koodiUri,
        versio,
      })),
    ];
  }, []);

  const latestKoulutukset = toPairs(
    groupBy(koulutukset, ({ koodiUri }) => koodiUri),
  ).map(([, versiot]) => maxBy(versiot, ({ versio }) => versio));

  return latestKoulutukset;
};

export const getKoulutusByKoodi = async ({
  httpClient,
  apiUrls,
  koodiUri: argKoodiUri,
}) => {
  const { koodiUri, versio } = getKoodiUriParts(argKoodiUri);

  const [
    perusteetResponse,
    alakooditResponse,
    koodiResponse,
  ] = await Promise.all([
    httpClient.get(
      apiUrls.url('eperusteet-service.perusteet-koulutuskoodilla', koodiUri),
    ),
    httpClient.get(
      apiUrls.url(
        'koodisto-service.sisaltyy-alakoodit',
        koodiUri,
        versio || '',
      ),
    ),
    httpClient.get(apiUrls.url('koodisto-service.codeelement', koodiUri)),
  ]);

  const {
    data: { data: perusteetData },
  } = perusteetResponse;

  const { data: koodiData } = koodiResponse;

  const { data: alakooditData = [] } = alakooditResponse;

  const koulutusalaKoodi = alakooditData.find(
    ({ koodiUri }) => koodiUri && /^okmohjauksenala_/.test(koodiUri),
  );

  const opintojenlaajuusKoodi = alakooditData.find(
    ({ koodiUri }) => koodiUri && /^opintojenlaajuus_/.test(koodiUri),
  );

  const opintojenlaajuusYksikkoKoodi = alakooditData.find(
    ({ koodiUri }) => koodiUri && /^opintojenlaajuusyksikko_/.test(koodiUri),
  );

  const koulutusala =
    koulutusalaKoodi && isArray(koulutusalaKoodi.metadata)
      ? keyBy(koulutusalaKoodi.metadata, ({ kieli }) =>
          kieli ? kieli.toLowerCase() : '_',
        )
      : null;

  const opintojenlaajuus =
    opintojenlaajuusKoodi && isArray(opintojenlaajuusKoodi.metadata)
      ? get(opintojenlaajuusKoodi.metadata, '[0].nimi') || null
      : null;

  const opintojenlaajuusYksikko =
    opintojenlaajuusYksikkoKoodi &&
    isArray(opintojenlaajuusYksikkoKoodi.metadata)
      ? keyBy(opintojenlaajuusYksikkoKoodi.metadata, ({ kieli }) =>
          kieli ? kieli.toLowerCase() : '_',
        )
      : null;

  const latestKoodi = isArray(koodiData)
    ? maxBy(koodiData, ({ versio }) => versio)
    : null;

  const nimi =
    latestKoodi && isArray(latestKoodi.metadata)
      ? keyBy(latestKoodi.metadata, ({ kieli }) =>
          kieli ? kieli.toLowerCase() : '_',
        )
      : null;

  const { kuvaus = null, osaamisalat = [], tutkintonimikeKoodit = [] } =
    perusteetData[0] || {};

  return {
    kuvaus,
    osaamisalat,
    tutkintonimikeKoodit,
    koulutusala: mapValues(koulutusala, ({ nimi }) => nimi || null),
    opintojenlaajuus,
    opintojenlaajuusYksikko: mapValues(
      opintojenlaajuusYksikko,
      ({ nimi }) => nimi || null,
    ),
    nimi: mapValues(nimi, ({ nimi: nimiField }) => nimiField || null),
  };
};
