import _ from 'lodash';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';

export const getKoulutusByKoodi = async ({
  httpClient,
  apiUrls,
  koodiUri: argKoodiUri,
}) => {
  const { koodi, versio } = parseKoodiUri(argKoodiUri);
  if (_.isNil(koodi)) {
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
                {
                  errorNotifier: {
                    silent: true,
                  },
                }
              )
              .then(
                ({ data: rakenne }) => ({
                  ...ePeruste,
                  laajuus: rakenne?.muodostumisSaanto?.laajuus?.minimi,
                }),
                () => ePeruste
              )
          )
        )
      ),
    httpClient.get(
      apiUrls.url('koodisto-service.sisaltyy-alakoodit', koodi, versio || '')
    ),
    httpClient.get(
      apiUrls.url('koodisto-service.codeelement', koodi, versio || '')
    ),
  ]);

  const { data: koodiData } = koodiResponse;

  const { data: alakooditData = [] } = alakooditResponse;

  const koulutusalaKoodi = alakooditData.find(
    ({ koodiUri }) => koodiUri && /^okmohjauksenala_/.test(koodiUri)
  );

  const opintojenlaajuusKoodi = alakooditData.find(
    ({ koodiUri }) => koodiUri && /^opintojenlaajuus_/.test(koodiUri)
  );

  const opintojenlaajuusYksikkoKoodi = alakooditData.find(
    ({ koodiUri }) => koodiUri && /^opintojenlaajuusyksikko_/.test(koodiUri)
  );

  const koulutusala =
    koulutusalaKoodi && _.isArray(koulutusalaKoodi.metadata)
      ? _.keyBy(koulutusalaKoodi.metadata, ({ kieli }) =>
          kieli ? kieli.toLowerCase() : '_'
        )
      : null;

  const opintojenlaajuus =
    opintojenlaajuusKoodi && _.isArray(opintojenlaajuusKoodi.metadata)
      ? _.get(opintojenlaajuusKoodi.metadata, '[0].nimi') || null
      : null;

  const opintojenlaajuusYksikko =
    opintojenlaajuusYksikkoKoodi &&
    _.isArray(opintojenlaajuusYksikkoKoodi.metadata)
      ? _.keyBy(opintojenlaajuusYksikkoKoodi.metadata, ({ kieli }) =>
          kieli ? kieli.toLowerCase() : '_'
        )
      : null;

  const latestKoodi = _.isArray(koodiData)
    ? _.maxBy(koodiData, ({ versio }) => versio)
    : koodiData;

  const nimi =
    latestKoodi && _.isArray(latestKoodi.metadata)
      ? _.keyBy(latestKoodi.metadata, ({ kieli }) =>
          kieli ? kieli.toLowerCase() : '_'
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
    koulutusala: _.mapValues(koulutusala, ({ nimi }) => nimi || null),
    opintojenlaajuus,
    opintojenlaajuusYksikko: _.mapValues(
      opintojenlaajuusYksikko,
      ({ nimi }) => nimi || null
    ),
    nimi: _.mapValues(nimi, ({ nimi: nimiField }) => nimiField || null),
  };
};
