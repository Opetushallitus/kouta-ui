import { KOULUTUSTYYPPI_CATEGORY_TO_KOULUTUSTYYPPI_IDS_MAP } from '../constants';
import { isArray } from '../utils';
import uniqBy from 'lodash/uniqBy';
import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';
import get from 'lodash/get';

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
      ...data.map(({ metadata, koodisto, koodiArvo, koodiUri }) => ({
        metadata,
        koodisto,
        koodiArvo,
        koodiUri,
      })),
    ];
  }, []);

  return uniqBy(koulutukset, ({ koodiUri }) => koodiUri);
};

export const getKoulutusByKoodi = async ({
  httpClient,
  apiUrls,
  koodiUri,
  versio = '',
}) => {
  const [perusteetResponse, alakooditResponse] = await Promise.all([
    httpClient.get(
      apiUrls.url('eperusteet-service.perusteet-koulutuskoodilla', koodiUri),
    ),
    httpClient.get(
      apiUrls.url('koodisto-service.sisaltyy-alakoodit', koodiUri, versio),
    ),
  ]);

  const {
    data: { data: perusteetData },
  } = perusteetResponse;

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

  const aikahakukohdeKoodi = alakooditData.find(
    ({ koodiUri }) => koodiUri && /^aikuhakukohteet_/.test(koodiUri),
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

  const nimi =
    aikahakukohdeKoodi && isArray(aikahakukohdeKoodi.metadata)
      ? keyBy(aikahakukohdeKoodi.metadata, ({ kieli }) =>
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
