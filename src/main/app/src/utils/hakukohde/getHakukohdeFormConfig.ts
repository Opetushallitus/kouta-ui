import _ from 'lodash';
import _fp from 'lodash/fp';

import {
  Alkamiskausityyppi,
  JULKAISUTILA,
  KOULUTUSTYYPIT,
  LIITTEEN_TOIMITUSTAPA,
} from '#/src/constants';
import { HakukohdeFormValues } from '#/src/types/hakukohdeTypes';
import {
  validateExistence,
  validateExistenceOfDate,
} from '#/src/utils/form/createErrorBuilder';
import createFormConfigBuilder from '#/src/utils/form/createFormConfigBuilder';
import {
  validateIfJulkaistu,
  getKielivalinta,
  kieliversiotSectionConfig,
  pohjaValintaSectionConfig,
  validateRelations,
  valintakokeetSection,
  validateIf,
} from '#/src/utils/form/formConfigUtils';

const getLiitteillaYhteinenToimitusaika = values =>
  !!_.get(values, 'liitteet.yhteinenToimitusaika');

const getLiitteillaYhteinenToimitusosoite = values =>
  !!_.get(values, 'liitteet.yhteinenToimituspaikka');

// TODO: Should this be implemented?
const validatejarjestyspaikkaOid = errorBuilder => {
  return errorBuilder;
};

const validateLiitteet = errorBuilder => {
  const values = errorBuilder.getValues();
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
        .validateTranslations('kuvaus', kieliversiot, { optional: true });

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
        validate: validateIfJulkaistu(eb =>
          _.get(eb.getValues(), 'hakuajat.eriHakuaika')
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
      { field: 'ajankohta' },
      {
        field: 'ajankohta.ajankohtaTyyppi',
        validate: (eb, values: HakukohdeFormValues) =>
          validateIf(
            values?.ajankohta?.kaytetaanHakukohteenAlkamiskautta &&
              values?.tila === JULKAISUTILA.JULKAISTU,
            validateExistence('ajankohta.ajankohtaTyyppi')
          )(eb),
      },
      {
        field: 'ajankohta.kausi',
      },
      {
        field: 'ajankohta.vuosi',
        validate: (eb, values: HakukohdeFormValues) =>
          validateIf(
            values?.ajankohta?.kaytetaanHakukohteenAlkamiskautta &&
              values?.ajankohta?.ajankohtaTyyppi ===
                Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI &&
              values?.tila === JULKAISUTILA.JULKAISTU,
            _fp.flow(
              validateExistence('ajankohta.kausi'),
              validateExistence('ajankohta.vuosi')
            )
          )(eb),
      },
      {
        field: 'ajankohta.tarkkaAlkaa',
        required: true,
        validate: (eb, values: HakukohdeFormValues) =>
          validateIf(
            values?.ajankohta?.kaytetaanHakukohteenAlkamiskautta &&
              values?.ajankohta?.ajankohtaTyyppi ===
                Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA &&
              values?.tila === JULKAISUTILA.JULKAISTU,
            validateExistenceOfDate('ajankohta.tarkkaAlkaa')
          )(eb),
      },
      {
        field: 'ajankohta.tarkkaPaattyy',
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
    parts: [
      {
        field: '.aloituspaikkakuvaus',
        validate: (eb, values) =>
          eb.validateTranslations(
            'aloituspaikat.aloituspaikkakuvaus',
            getKielivalinta(values)
          ),
      },
    ],
  },
  {
    section: 'valintaperusteenKuvaus',
    field: 'valintaperusteenKuvaus',
  },
  valintakokeetSection,
  {
    section: 'liitteet',
    field: 'liitteet',
    validate: validateIfJulkaistu(validateLiitteet),
  },
  {
    section: 'jarjestyspaikkaOid',
    field: 'jarjestyspaikkaOid',
    validate: validateIfJulkaistu(validatejarjestyspaikkaOid),
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
  {
    section: 'esikatselu',
    field: 'esikatselu',
    koulutustyypit: KOULUTUSTYYPIT,
  },
]);

const getHakukohdeFormConfig = () => config.getConfig();

export default getHakukohdeFormConfig;
