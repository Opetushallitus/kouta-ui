import { KOULUTUSTYYPPI_CATEGORY_TO_KOULUTUSTYYPPI_IDS_MAP } from '../constants';
import { isArray, isString, isObject } from '../utils';
import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import toPairs from 'lodash/toPairs';
import maxBy from 'lodash/maxBy';
import upperFirst from 'lodash/upperFirst';
import memoize from 'memoizee';

const getKoodiUriParts = uri => {
  const [koodiUri, versio = null] = uri.split('#');

  return {
    koodiUri,
    versio,
  };
};

const memoizedGetKoulutuksetByKoulutusTyyppi = memoize(
  async (httpClient, apiUrls, koulutusTyyppi) => {
    const ids =
      KOULUTUSTYYPPI_CATEGORY_TO_KOULUTUSTYYPPI_IDS_MAP[koulutusTyyppi];

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
  },
  { promise: true },
);

export const getKoulutuksetByKoulutusTyyppi = async ({
  httpClient,
  apiUrls,
  koulutusTyyppi,
}) => {
  return memoizedGetKoulutuksetByKoulutusTyyppi(
    httpClient,
    apiUrls,
    koulutusTyyppi,
  );
};

const memoizedGetKoulutusByKoodi = memoize(
  async (httpClient, apiUrls, argKoodiUri) => {
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

    const {
      kuvaus = null,
      osaamisalat = [],
      tutkintonimikeKoodit = [],
      id: perusteId,
    } = perusteetData[0] || {};

    return {
      koodiUri,
      perusteId,
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
  },
  { promise: true },
);

export const getKoulutusByKoodi = ({ httpClient, apiUrls, koodiUri }) => {
  return memoizedGetKoulutusByKoodi(httpClient, apiUrls, koodiUri);
};

const memoizedGetOrganisaatioHierarchyByOid = memoize(
  async (httpClient, apiUrls, oid) => {
    const { data } = await httpClient.get(
      apiUrls.url('organisaatio-service.hierarkia', oid),
    );

    return get(data, 'organisaatiot') || [];
  },
  { promise: true },
);

export const getOrganisaatioHierarchyByOid = async ({
  oid,
  apiUrls,
  httpClient,
}) => {
  return memoizedGetOrganisaatioHierarchyByOid(httpClient, apiUrls, oid);
};

const memoizedGetOrganisaatioByOid = memoize(
  async (httpClient, apiUrls, oid) => {
    const { data } = await httpClient.get(
      apiUrls.url('organisaatio-service.organisaatio-by-oid', oid),
    );

    return data;
  },
  { promise: true },
);

export const getOrganisaatioByOid = ({ oid, apiUrls, httpClient }) => {
  return memoizedGetOrganisaatioByOid(httpClient, apiUrls, oid);
};

export const getKoutaKoulutusByOid = async ({ oid, apiUrls, httpClient }) => {
  const { data, headers } = await httpClient.get(
    apiUrls.url('kouta-backend.koulutus-by-oid', oid),
  );

  const lastModified = get(headers, 'last-modified') || null;

  return isObject(data) ? { lastModified, ...data } : data;
};

export const getOsaamisalatByKoulutusKoodi = async ({
  httpClient,
  apiUrls,
  koodiUri: argKoodiUri,
}) => {
  const { koodiUri } = getKoodiUriParts(argKoodiUri);

  const { data } = await httpClient.get(
    apiUrls.url('eperusteet-service.perusteet-koulutuskoodilla', koodiUri),
  );

  const { osaamisalat = [] } = data.data[0] || {};

  return osaamisalat;
};

export const getOsaamisalakuvauksetByPerusteId = async ({
  httpClient,
  apiUrls,
  perusteId,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('eperusteet-service.osaamisalakuvaukset', perusteId),
  );

  return get(data, 'reformi') ? data.reformi : {};
};

export const getAmmattinimikkeetByTerm = async ({
  httpClient,
  apiUrls,
  term,
  limit = 15,
  language = 'fi',
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.ammattinimike-search', term),
    { params: { limit, kieli: language } },
  );

  return data;
};

export const getAvainsanatByTerm = async ({
  httpClient,
  apiUrls,
  term,
  limit = 15,
  language = 'fi',
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.asiasana-search', term),
    { params: { limit, kieli: language } },
  );

  return data;
};

const memoizedGetKoodisto = memoize(
  async (httpClient, apiUrls, koodistoUri, koodistoVersio) => {
    const { data } = await httpClient.get(
      apiUrls.url('koodisto-service.koodi', koodistoUri),
      { params: { koodistoVersio } },
    );

    return data;
  },
  { promise: true },
);

export const getKoodisto = ({
  koodistoUri,
  httpClient,
  apiUrls,
  koodistoVersio = '',
}) => {
  return memoizedGetKoodisto(httpClient, apiUrls, koodistoUri, koodistoVersio);
};

export const getLocalisation = async ({
  category = '',
  httpClient,
  apiUrls,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('lokalisaatio-service.localisation', category),
  );

  let resource = {};

  for (const translation of data) {
    const locale = translation.locale.toLowerCase();
    const { key, value } = translation;

    if (locale && key && value) {
      resource[locale] = resource[locale] || { translation: {} };
      resource[locale].translation[key] = value;
    }
  }

  return resource;
};

export const getOrganisaatioContactInfo = organisaatio => {
  const postitoimipaikka = get(organisaatio, 'kayntiosoite.postitoimipaikka');
  const postinumeroUri = get(organisaatio, 'kayntiosoite.postinumeroUri');
  const [, postinumero] = postinumeroUri ? postinumeroUri.split('_') : [];
  const sahkopostiYhteystieto = (get(organisaatio, 'yhteystiedot') || []).find(
    ({ email }) => isString(email),
  );
  const sahkoposti = sahkopostiYhteystieto ? sahkopostiYhteystieto.email : null;

  return {
    osoite: get(organisaatio, 'kayntiosoite.osoite') || null,
    postitoimipaikka: postitoimipaikka
      ? upperFirst(postitoimipaikka.toLowerCase())
      : null,
    postinumero: postinumero || null,
    sahkoposti,
  };
};

export const getKoutaToteutusByOid = async ({ oid, httpClient, apiUrls }) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.toteutus-by-oid', oid),
  );

  return data;
};

export const getKoutaHakuByOid = async ({ oid, httpClient, apiUrls }) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.haku-by-oid', oid),
  );

  return data;
};

export const getKoutaValintaperusteet = async ({
  organisaatioOid,
  hakuOid,
  httpClient,
  apiUrls,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.valintaperuste-list'),
    {
      params: { organisaatioOid, hakuOid },
    },
  );

  return data;
};

export const getKoutaKoulutukset = async ({
  organisaatioOid,
  httpClient,
  apiUrls,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.koulutus-list'),
    {
      params: { organisaatioOid },
    },
  );

  return data;
};

export const getKoutaToteutukset = async ({
  organisaatioOid,
  httpClient,
  apiUrls,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.toteutus-list'),
    {
      params: { organisaatioOid },
    },
  );

  return data;
};

export const getKoutaKoulutusToteutukset = async ({
  httpClient,
  apiUrls,
  oid,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.koulutus-toteutukset', oid),
  );

  return data;
};

export const updateKoutaKoulutus = async ({
  koulutus,
  httpClient,
  apiUrls,
}) => {
  const { lastModified = '', ...rest } = koulutus;

  const headers = {
    'If-Unmodified-Since': lastModified,
  };

  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.koulutus'),
    rest,
    { headers },
  );

  return data;
};
