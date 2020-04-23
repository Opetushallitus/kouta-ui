import { KOULUTUSTYYPPI_TO_KOULUTUSTYYPPI_IDS_MAP } from '../constants';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';
import {
  get,
  groupBy,
  isArray,
  isNil,
  keyBy,
  mapValues,
  maxBy,
  set,
  toPairs,
} from 'lodash';

export const getKoulutuksetByKoulutusTyyppi = async ({
  httpClient,
  apiUrls,
  koulutusTyyppi,
}) => {
  const ids = KOULUTUSTYYPPI_TO_KOULUTUSTYYPPI_IDS_MAP[koulutusTyyppi];

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

  return latestKoulutukset.filter(({ koodiUri }) =>
    /^koulutus_/.test(koodiUri),
  );
};

export const getEPerusteById = async ({ httpClient, apiUrls, ePerusteId }) => {
  if (ePerusteId) {
    const { data } = await httpClient.get(
      apiUrls.url('eperusteet-service.peruste-by-id', ePerusteId),
    );
    return data;
  }
};

export const getKoulutusByKoodi = async ({
  httpClient,
  apiUrls,
  koodiUri: argKoodiUri,
}) => {
  const { koodi, versio } = parseKoodiUri(argKoodiUri);
  if (isNil(koodi)) {
    return null;
  }

  const [ePerusteetData, alakooditResponse, koodiResponse] = await Promise.all([
    httpClient
      .get(apiUrls.url('eperusteet-service.perusteet-koulutuskoodilla', koodi))
      .then(({ data: { data: ePerusteet } }) =>
        Promise.all(
          ePerusteet.map(ePeruste =>
            httpClient
              .get(
                apiUrls.url('eperusteet-service.peruste-rakenne', ePeruste.id),
              )
              .then(({ data: rakenne }) => ({
                ...ePeruste,
                laajuus: get(rakenne, 'muodostumisSaanto.laajuus.minimi'),
              })),
          ),
        ),
      ),
    httpClient.get(
      apiUrls.url('koodisto-service.sisaltyy-alakoodit', koodi, versio || ''),
    ),
    httpClient.get(
      apiUrls.url('koodisto-service.codeelement', koodi, versio || ''),
    ),
  ]);

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
    : koodiData;

  const nimi =
    latestKoodi && isArray(latestKoodi.metadata)
      ? keyBy(latestKoodi.metadata, ({ kieli }) =>
          kieli ? kieli.toLowerCase() : '_',
        )
      : null;

  const { koodiArvo } = latestKoodi;

  const { kuvaus = null, osaamisalat = [], tutkintonimikeKoodit = [] } =
    ePerusteetData[0] || {};

  return {
    koodiArvo,
    koodiUri: koodi,
    ePerusteet: ePerusteetData,
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

export const getOsaamisalakuvauksetByPerusteId = async ({
  httpClient,
  apiUrls,
  ePerusteId,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('eperusteet-service.osaamisalakuvaukset', ePerusteId),
  );

  return get(data, 'reformi') || {};
};

export const getLocalisation = async ({
  category = 'kouta',
  locale = '',
  httpClient,
  apiUrls,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('lokalisaatio-service.localisation', category),
    {
      params: { locale },
    },
  );

  let resource = {};

  // eslint-disable-next-line
  for (const translation of data) {
    const lng = translation.locale.toLowerCase();
    const { key, value } = translation;

    if (lng === locale && key && value) {
      set(resource, key, value);
    }
  }

  return resource;
};

export const getMe = async ({ httpClient, apiUrls }) => {
  const { data } = await httpClient.get(apiUrls.url('kayttooikeus-service.me'));

  return data;
};

export const getHakemuspalveluLomakkeet = async ({ httpClient, apiUrls }) => {
  const { data } = await httpClient.get(
    apiUrls.url('lomake-editori.lomakkeet'),
  );

  return get(data, 'forms') || [];
};

export const getOppijanumerorekisteriHenkilo = async ({
  httpClient,
  apiUrls,
  oid,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('oppijanumerorekisteri-service.henkilo', oid),
  );

  return data;
};
