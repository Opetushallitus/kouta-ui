import _ from 'lodash';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
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

  const fetchRakenneAndTutkinnonOsat = ePeruste => {
    const config = {
      errorNotifier: {
        silent: true,
      },
    };
    const fetchRakenne = httpClient.get(
      apiUrls.url('eperusteet-service.peruste-rakenne', ePeruste.id),
      config
    );
    const fetchTutkinnonosat = httpClient.get(
      apiUrls.url('eperusteet-service.peruste-tutkinnonosat', ePeruste.id),
      config
    );

    return Promise.all([fetchRakenne, fetchTutkinnonosat]).then(
      ([{ data: rakenne }, { data: tutkinnonosat }]) => ({
        ...ePeruste,
        laajuus: rakenne?.muodostumisSaanto?.laajuus?.minimi,
        tutkinnonosat: tutkinnonosat,
      }),
      () => ePeruste
    );
  };

  const [ePerusteetData, alakooditResponse, koodiResponse] = await Promise.all([
    httpClient
      .get(apiUrls.url('eperusteet-service.perusteet-koulutuskoodilla', koodi))
      .then(({ data: { data: ePerusteet } }) =>
        Promise.all(
          ePerusteet
            .filter(
              ePeruste =>
                ePeruste?.tila === 'valmis' ||
                (ePeruste?.tila === 'luonnos' &&
                  ePeruste?.perusteprojekti?.esikatseltavissa === true)
            )
            .map(fetchRakenneAndTutkinnonOsat)
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

  const opintojenlaajuusYksikkoKoodi = alakooditData.find(
    ({ koodiUri }) => koodiUri && /^opintojenlaajuusyksikko_/.test(koodiUri)
  );

  const koulutustyyppiKoodit = alakooditData
    .map(({ koodiUri }) => koodiUri?.startsWith('koulutustyyppi_') && koodiUri)
    .filter(Boolean);

  const koulutusala =
    koulutusalaKoodi && _.isArray(koulutusalaKoodi.metadata)
      ? _.keyBy(koulutusalaKoodi.metadata, ({ kieli }) =>
          kieli ? kieli.toLowerCase() : '_'
        )
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

  const {
    kuvaus = null,
    osaamisalat = [],
    tutkintonimikeKoodit = [],
  } = ePerusteetData[0] || {};

  return {
    koodiArvo,
    koodiUri: koodi,
    ePerusteet: ePerusteetData,
    kuvaus,
    osaamisalat,
    tutkintonimikeKoodit,
    koulutusala: _.mapValues(koulutusala, ({ nimi }) => nimi || null),
    opintojenlaajuusYksikko: _.mapValues(
      opintojenlaajuusYksikko,
      ({ nimi }) => nimi || null
    ),
    koulutustyyppiKoodit,
    nimi: _.mapValues(nimi, ({ nimi: nimiField }) => nimiField || null),
  };
};

export const useKoulutusByKoodi = props =>
  useApiQuery('getKoulutusByKoodi', getKoulutusByKoodi, props, {
    ...LONG_CACHE_QUERY_OPTIONS,
    enabled: Boolean(props?.koodiUri),
  });
