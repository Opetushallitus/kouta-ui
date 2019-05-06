import { KOULUTUSTYYPPI_CATEGORY_TO_KOULUTUSTYYPPI_IDS_MAP } from '../constants';
import { isArray, isString, isObject, memoizePromise } from '../utils';
import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import toPairs from 'lodash/toPairs';
import maxBy from 'lodash/maxBy';
import upperFirst from 'lodash/upperFirst';
import set from 'lodash/set';

const getKoodiUriParts = uri => {
  const [koodiUri, versio = null] = uri.split('#');

  return {
    koodiUri,
    versio,
  };
};

const memoizedGetKoulutuksetByKoulutusTyyppi = memoizePromise(
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

const memoizedGetKoulutusByKoodi = memoizePromise(
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
);

const memoizedGetHakuByKoodi = memoizePromise(
  async (httpClient, apiUrls, argKoodiUri) => {
    const { koodiUri } = getKoodiUriParts(argKoodiUri);

    const [koodiResponse] = await Promise.all([
      httpClient.get(apiUrls.url('koodisto-service.codeelement', koodiUri)),
    ]);

    const { data: koodiData } = koodiResponse;

    const latestKoodi = isArray(koodiData)
      ? maxBy(koodiData, ({ versio }) => versio)
      : null;

    const nimi =
      latestKoodi && isArray(latestKoodi.metadata)
        ? keyBy(latestKoodi.metadata, ({ kieli }) =>
            kieli ? kieli.toLowerCase() : '_',
          )
        : null;

    return {
      nimi: mapValues(nimi, ({ nimi: nimiField }) => nimiField || null),
    };
  },
  { promise: true },
);

export const getKoulutusByKoodi = ({ httpClient, apiUrls, koodiUri }) => {
  return memoizedGetKoulutusByKoodi(httpClient, apiUrls, koodiUri);
};

export const getHakuByKoodi = ({ httpClient, apiUrls, koodiUri }) => {
  return memoizedGetHakuByKoodi(httpClient, apiUrls, koodiUri);
};

const memoizedGetOrganisaatioHierarchyByOid = memoizePromise(
  async (httpClient, apiUrls, oid) => {
    const { data } = await httpClient.get(
      apiUrls.url('organisaatio-service.hierarkia', oid),
    );

    return get(data, 'organisaatiot') || [];
  },
);

export const getOrganisaatioHierarchyByOid = async ({
  oid,
  apiUrls,
  httpClient,
}) => {
  return memoizedGetOrganisaatioHierarchyByOid(httpClient, apiUrls, oid);
};

const memoizedGetOrganisaatioByOid = memoizePromise(
  async (httpClient, apiUrls, oid) => {
    const { data } = await httpClient.get(
      apiUrls.url('organisaatio-service.organisaatio-by-oid', oid),
    );

    return data;
  },
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

const memoizedGetKoodisto = memoizePromise(
  async (httpClient, apiUrls, koodistoUri, koodistoVersio) => {
    const { data } = await httpClient.get(
      apiUrls.url('koodisto-service.koodi', koodistoUri),
      { params: { koodistoVersio } },
    );

    return data;
  },
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

  for (const translation of data) {
    const lng = translation.locale.toLowerCase();
    const { key, value } = translation;

    if (lng === locale && key && value) {
      set(resource, key, value);
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
  const { data, headers } = await httpClient.get(
    apiUrls.url('kouta-backend.toteutus-by-oid', oid),
  );

  const lastModified = get(headers, 'last-modified') || null;

  return isObject(data) ? { lastModified, ...data } : data;
};

export const getKoutaHakuByOid = async ({ oid, httpClient, apiUrls }) => {
  const { data, headers } = await httpClient.get(
    apiUrls.url('kouta-backend.haku-by-oid', oid),
  );

  const lastModified = get(headers, 'last-modified') || null;

  return isObject(data) ? { lastModified, ...data } : data;
};

export const getKoutaHakuHakukohteet = async ({
  httpClient,
  apiUrls,
  organisaatioOid,
  oid,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.haku-hakukohteet', oid),
    {
      params: { organisaatioOid },
    },
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
      params: { organisaatioOid, ...(hakuOid && { hakuOid }) },
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

export const updateKoutaHaku = async ({ haku, httpClient, apiUrls }) => {
  const { lastModified = '', ...rest } = haku;

  const headers = {
    'If-Unmodified-Since': lastModified,
  };

  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.haku'),
    rest,
    { headers },
  );

  return data;
};

export const getKoutaHaut = async ({
  organisaatioOid,
  httpClient,
  apiUrls,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.haku-list'),
    {
      params: { organisaatioOid },
    },
  );

  return data;
};

const memoizedGetKayttajanOrganisaatioOids = memoizePromise(
  async (httpClient, apiUrls) => {
    const { data } = await httpClient.get(
      apiUrls.url('kayttooikeus-service.kayttajan-organisaatiot'),
      { params: { kayttajaTyyppi: 'VIRKAILIJA' } },
    );

    return data;
  },
);

export const getKayttajanOrganisaatioOids = async ({
  oid,
  httpClient,
  apiUrls,
}) => {
  return memoizedGetKayttajanOrganisaatioOids(httpClient, apiUrls, oid);
};

const toKoutaIndexParams = ({
  organisaatioOid: organisaatioOidArg = [],
  nimi = '',
  language = 'fi',
  pageSize = 10,
  showArchived = false,
  page = 1,
  orderField,
  orderDirection,
  tila,
}) => {
  const organisaatio = organisaatioOidArg.join(',');

  const params = {
    ...(nimi && { nimi }),
    ...(orderField && { 'order-by': orderField }),
    ...(orderDirection && { order: orderDirection }),
    ...(tila && { tila }),
    organisaatio,
    language,
    size: pageSize,
    arkistoidut: showArchived,
    page,
  };

  return params;
};

export const getKoutaIndexKoulutukset = async ({
  httpClient,
  apiUrls,
  ...rest
}) => {
  const params = toKoutaIndexParams(rest);

  const { data } = await httpClient.get(
    apiUrls.url('kouta-index.koulutus-list'),
    { params },
  );

  return data;
};

export const updateKoutaToteutus = async ({
  toteutus,
  httpClient,
  apiUrls,
}) => {
  const { lastModified = '', ...rest } = toteutus;

  const headers = {
    'If-Unmodified-Since': lastModified,
  };

  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.toteutus'),
    rest,
    { headers },
  );

  return data;
};

export const getKoutaToteutusHakukohteet = async ({
  httpClient,
  apiUrls,
  oid,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.toteutus-hakukohteet', oid),
  );

  return data;
};

export const getKoutaIndexToteutukset = async ({
  httpClient,
  apiUrls,
  ...rest
}) => {
  const params = toKoutaIndexParams(rest);

  const { data } = await httpClient.get(
    apiUrls.url('kouta-index.toteutus-list'),
    { params },
  );

  return data;
};

export const getKoutaHakukohteet = async ({
  httpClient,
  apiUrls,
  organisaatioOid,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.hakukohde-list'),
    {
      params: { organisaatioOid },
    },
  );

  return data;
};

export const getKoutaHakukohdeByOid = async ({ oid, httpClient, apiUrls }) => {
  const { data, headers } = await httpClient.get(
    apiUrls.url('kouta-backend.hakukohde-by-oid', oid),
  );

  const lastModified = get(headers, 'last-modified') || null;

  return isObject(data) ? { lastModified, ...data } : data;
};

export const updateKoutaHakukohde = async ({
  hakukohde,
  httpClient,
  apiUrls,
}) => {
  const { lastModified = '', ...rest } = hakukohde;

  const headers = {
    'If-Unmodified-Since': lastModified,
  };

  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.hakukohde'),
    rest,
    { headers },
  );

  return data;
};

export const getKoutaIndexHaut = async ({ httpClient, apiUrls, ...rest }) => {
  const params = toKoutaIndexParams(rest);

  const { data } = await httpClient.get(apiUrls.url('kouta-index.haku-list'), {
    params,
  });

  return data;
};

export const getAndUpdateKoutaKoulutus = async ({
  httpClient,
  apiUrls,
  koulutus: koulutusUpdate,
}) => {
  const { oid, ...update } = koulutusUpdate;

  if (!oid) {
    throw Error('Koulutuksella täytyy olla oid');
  }

  const koulutus = await getKoutaKoulutusByOid({ oid, httpClient, apiUrls });

  return updateKoutaKoulutus({
    httpClient,
    apiUrls,
    koulutus: { ...koulutus, ...update },
  });
};

export const getAndUpdateKoutaToteutus = async ({
  httpClient,
  apiUrls,
  toteutus: toteutusUpdate,
}) => {
  const { oid, ...update } = toteutusUpdate;

  if (!oid) {
    throw new Error('Toteutuksella täytyy olla oid');
  }

  const toteutus = await getKoutaToteutusByOid({ oid, httpClient, apiUrls });

  return updateKoutaToteutus({
    httpClient,
    apiUrls,
    toteutus: { ...toteutus, ...update },
  });
};

const memoizedGetKoulutustyyppiByKoulutusOid = memoizePromise(
  async (oid, httpClient, apiUrls) => {
    const koulutus = await getKoutaKoulutusByOid({ oid, httpClient, apiUrls });

    return get(koulutus, 'koulutustyyppi') || null;
  },
);

export const getKoulutustyyppiByKoulutusOid = ({
  oid,
  httpClient,
  apiUrls,
}) => {
  return memoizedGetKoulutustyyppiByKoulutusOid(oid, httpClient, apiUrls);
};

export const getKoutaValintaperusteByOid = async ({
  oid,
  httpClient,
  apiUrls,
}) => {
  const { data, headers } = await httpClient.get(
    apiUrls.url('kouta-backend.valintaperuste-by-oid', oid),
  );

  const lastModified = get(headers, 'last-modified') || null;

  return isObject(data) ? { lastModified, ...data } : data;
};

export const updateKoutaValintaperuste = async ({
  valintaperuste,
  httpClient,
  apiUrls,
}) => {
  const { lastModified = '', ...rest } = valintaperuste;

  const headers = {
    'If-Unmodified-Since': lastModified,
  };

  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.valintaperuste'),
    rest,
    { headers },
  );

  return data;
};

export const getKoutaIndexValintaperusteet = async ({
  httpClient,
  apiUrls,
  ...rest
}) => {
  const params = toKoutaIndexParams(rest);

  const { data } = await httpClient.get(
    apiUrls.url('kouta-index.valintaperuste-list'),
    {
      params,
    },
  );

  return data;
};

const memoizedGetMe = memoizePromise(async (httpClient, apiUrls) => {
  const { data } = await httpClient.get(apiUrls.url('kayttooikeus-service.me'));

  return data;
});

export const getMe = ({ httpClient, apiUrls }) =>
  memoizedGetMe(httpClient, apiUrls);

export const getOrganisaatiotByOids = async ({ oids, httpClient, apiUrls }) => {
  const { data } = await httpClient.post(
    apiUrls.url('organisaatio-service.organisaatiot-by-oids'),
    oids,
  );

  return data;
};

export const getOrganisaatioHierarkia = async ({
  searchString = '',
  aktiiviset = true,
  suunnitellut = true,
  lakkautetut = false,
  apiUrls,
  httpClient,
}) => {
  const params = {
    searchStr: searchString,
    aktiiviset: aktiiviset ? 'true' : 'false',
    suunnitellut: suunnitellut ? 'true' : 'false',
    lakkautetut: lakkautetut ? 'true' : 'false',
  };

  const { data } = await httpClient.get(
    apiUrls.url('organisaatio-service.hierarkia-haku'),
    { params },
  );

  return get(data, 'organisaatiot') || [];
};

export const koutaBackendLogin = async ({ httpClient, apiUrls }) => {
  const { data } = await httpClient.get(apiUrls.url('kouta-backend.login'));

  return data;
};

const memoizedGetHakemuspaveluLomakkeet = memoizePromise(
  async (httpClient, apiUrls) => {
    const { data } = await httpClient.get(
      apiUrls.url('lomake-editori.lomakkeet'),
    );

    return get(data, 'forms') || [];
  },
);

export const getHakumuspalveluLomakkeet = ({ httpClient, apiUrls }) =>
  memoizedGetHakemuspaveluLomakkeet(httpClient, apiUrls);
