import _ from 'lodash';

import { LIITTEEN_TOIMITUSTAPA } from '#/src/constants';

import createFormConfigBuilder from './createFormConfigBuilder';

import {
  validateIfJulkaistu,
  getKielivalinta,
  kieliversiotSectionConfig,
  pohjaValintaSectionConfig,
  validateRelations,
} from '#/src/utils/formConfigUtils';

const getLiitteillaYhteinenToimitusaika = values =>
  !!_.get(values, 'liitteet.yhteinenToimitusaika');

const getLiitteillaYhteinenToimitusosoite = values =>
  !!_.get(values, 'liitteet.yhteinenToimituspaikka');

const validateLiitteet = (errorBuilder, values) => {
  const kieliversiot = getKielivalinta(values);

  const liitteillaYhteinenToimitusaika = getLiitteillaYhteinenToimitusaika(
    values
  );

  const liitteillaYhteinenToimitusosoite = getLiitteillaYhteinenToimitusosoite(
    values
  );

  let enhancedErrorBuilder = errorBuilder.validateArray(
    'liitteet.liitteet',
    (liitteetEb, liite) => {
      let enhancedLiitteetEb = liitteetEb
        .validateExistence('tyyppi')
        .validateTranslations('nimi', kieliversiot)
        .validateTranslations('kuvaus', kieliversiot);

      if (!liitteillaYhteinenToimitusaika) {
        enhancedLiitteetEb = enhancedLiitteetEb.validateExistence(
          'toimitusaika'
        );
      }

      if (!liitteillaYhteinenToimitusosoite) {
        enhancedLiitteetEb = enhancedLiitteetEb.validateExistence(
          'toimitustapa.tapa'
        );
      }

      if (
        !liitteillaYhteinenToimitusosoite &&
        _.get(liite, 'toimitustapa.tapa') === LIITTEEN_TOIMITUSTAPA.MUU_OSOITE
      ) {
        enhancedLiitteetEb = enhancedLiitteetEb
          .validateTranslations('toimitustapa.paikka.osoite', kieliversiot)
          .validateExistence('toimitustapa.paikka.postinumero')
          .validateExistence('toimitustapa.paikka.sahkoposti');
      }

      return enhancedLiitteetEb;
    }
  );

  if (liitteillaYhteinenToimitusaika) {
    enhancedErrorBuilder = enhancedErrorBuilder.validateExistence(
      'liitteet.toimitusaika'
    );
  }

  if (liitteillaYhteinenToimitusosoite) {
    enhancedErrorBuilder = enhancedErrorBuilder.validateExistence(
      'liitteet.toimitustapa.tapa'
    );
  }

  if (
    liitteillaYhteinenToimitusosoite &&
    _.get(values, 'liitteet.toimitustapa.tapa') ===
      LIITTEEN_TOIMITUSTAPA.MUU_OSOITE
  ) {
    enhancedErrorBuilder = enhancedErrorBuilder
      .validateTranslations('liitteet.toimitustapa.paikka.osoite', kieliversiot)
      .validateExistence('liitteet.toimitustapa.paikka.postinumero')
      .validateExistence('liitteet.toimitustapa.paikka.sahkoposti');
  }

  return enhancedErrorBuilder;
};

const validateValintakokeet = (errorBuilder, values) => {
  const valintakoeTyypit = _.get(values, 'valintakoe.tyypit');
  const kieliversiot = getKielivalinta(values);

  return _.reduce(
    valintakoeTyypit,
    (ebAcc, { value: tyyppi }) =>
      ebAcc
        .validateArrayMinLength(`valintakoe.tilaisuudet.${tyyppi}`, 1, {
          isFieldArray: true,
        })
        .validateArray(`valintakoe.tilaisuudet.${tyyppi}`, eb =>
          eb
            .validateTranslations('osoite', kieliversiot)
            .validateExistence('postinumero')
            .validateExistence('alkaa')
            .validateExistence('paattyy')
        ),
    errorBuilder
  );
};

const config = createFormConfigBuilder().registerSections([
  pohjaValintaSectionConfig,
  kieliversiotSectionConfig,
  {
    section: 'pohjakoulutus',
    field: 'pohjakoulutus',
    parts: [
      {
        field: '.pohjakoulutusvaatimus',
        validate: validateIfJulkaistu(eb =>
          eb.validateArrayMinLength('pohjakoulutus.pohjakoulutusvaatimus', 1)
        ),
        required: true,
      },
    ],
  },
  {
    section: 'perustiedot',
    field: 'perustiedot',
    parts: [
      {
        field: '.nimi',
        validate: (eb, values) =>
          eb.validateTranslations('perustiedot.nimi', getKielivalinta(values)),
        required: true,
      },
      {
        field: 'hakuajat',
        validate: validateIfJulkaistu((eb, values) =>
          _.get(values, 'hakuajat.eriHakuaika')
            ? eb
                .validateArrayMinLength('hakuajat.hakuajat', 1, {
                  isFieldArray: true,
                })
                .validateArray('hakuajat.hakuajat', eb =>
                  eb.validateExistence('alkaa')
                )
            : eb
        ),
      },
      {
        field: 'hakuajat.hakuajat.alkaa',
        required: true,
      },
      {
        field: 'alkamiskausi',
      },
      {
        field: 'alkamiskausi.kausi',
        required: true,
      },
      {
        field: 'hakulomake',
      },
    ],
  },
  {
    section: 'hakuajat',
    field: 'hakuajat',
  },
  {
    section: 'aloituspaikat',
    field: 'aloituspaikat',
  },
  {
    section: 'valintaperusteenKuvaus',
    field: 'valintaperusteenKuvaus',
  },
  {
    section: 'valintakoe',
    parts: [
      {
        field: '.tyypit',
        validate: validateIfJulkaistu((eb, values) =>
          validateValintakokeet(eb, values)
        ),
      },
      {
        field: '.tilaisuudet',
      },
      {
        field: '.tilaisuudet.osoite',
        required: true,
      },
      {
        field: '.tilaisuudet.postinumero',
        required: true,
      },
      {
        field: '.tilaisuudet.alkaa',
        required: true,
      },
      {
        field: '.tilaisuudet.paattyy',
        required: true,
      },
    ],
  },
  {
    section: 'liitteet',
    field: 'liitteet',
    validate: validateIfJulkaistu((eb, values) => validateLiitteet(eb, values)),
  },
  {
    section: 'tila',
    field: 'tila',
    required: true,
    validate: (eb, values) =>
      validateRelations([
        {
          key: 'haku',
          t: 'yleiset.haku',
        },
        {
          key: 'toteutus',
          t: 'yleiset.toteutus',
        },
        {
          key: 'valintaperuste',
          t: 'yleiset.valintaperuste',
        },
      ])(eb.validateExistence('tila'), values),
  },
]);

const getHakukohdeFormConfig = () => config.getConfig();

export default getHakukohdeFormConfig;
