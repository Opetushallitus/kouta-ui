import _ from 'lodash/fp';

import createFormConfigBuilder from '#/src/utils/form/createFormConfigBuilder';

import {
  validateExistence,
  validateInteger,
} from '#/src/utils/form/createErrorBuilder';

import {
  KOULUTUSTYYPPI,
  KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT,
  JULKAISUTILA,
} from '#/src/constants';

import {
  validateIfJulkaistu,
  getKielivalinta,
  kieliversiotSectionConfig,
  pohjaValintaSectionConfig,
  validateRelations,
  createOptionalTranslatedFieldConfig,
} from '#/src/utils/form/formConfigUtils';

const config = createFormConfigBuilder().registerSections([
  pohjaValintaSectionConfig,
  kieliversiotSectionConfig,
  {
    section: 'tiedot',
    fragments: [],
    parts: [
      {
        fragment: 'nimi',
        field: '.nimi',
        koulutustyypit: _.without(
          [
            KOULUTUSTYYPPI.LUKIOKOULUTUS,
            KOULUTUSTYYPPI.VALMA,
            KOULUTUSTYYPPI.TELMA,
            KOULUTUSTYYPPI.LUVA,
            KOULUTUSTYYPPI.PERUSOPETUKSEN_LISAOPETUS,
          ],
          KOULUTUSTYYPIT
        ),
        required: true,
        validate: (eb, values) =>
          eb.validateTranslations('tiedot.nimi', getKielivalinta(values)),
      },
      {
        field: '.ilmoittautumislinkki',
        koulutustyypit: _.without(
          [KOULUTUSTYYPPI.OSAAMISALA, KOULUTUSTYYPPI.TUTKINNON_OSA],
          TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT
        ),
      },
      {
        field: '.laajuus',
        koulutustyypit: TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT,
      },
      {
        field: '.laajuusyksikko',
        koulutustyypit: TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT,
      },
      {
        field: '.aloituspaikat',
        koulutustyypit: _.without(
          [
            KOULUTUSTYYPPI.VALMA,
            KOULUTUSTYYPPI.TELMA,
            KOULUTUSTYYPPI.LUVA,
            KOULUTUSTYYPPI.PERUSOPETUKSEN_LISAOPETUS,
          ],
          TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT
        ),
      },
    ],
  },
  {
    section: 'kuvaus',
    parts: [
      createOptionalTranslatedFieldConfig({
        name: 'kuvaus',
        koulutustyypit: _.without(
          [KOULUTUSTYYPPI.LUKIOKOULUTUS],
          KOULUTUSTYYPIT
        ),
      }),
    ],
  },
  {
    section: 'lukiolinjat',
    field: '.lukiolinja',
    koulutustyypit: [KOULUTUSTYYPPI.LUKIOKOULUTUS],
    validate: eb => eb.validateExistence('lukiolinjat.lukiolinja'),
  },
  {
    section: 'tutkinnonOsat',
    field: 'tutkinnonOsat',
    koulutustyypit: [KOULUTUSTYYPPI.TUTKINNON_OSA],
  },
  {
    section: 'toteutusjaksot',
    field: 'toteutusjaksot',
    koulutustyypit: [
      KOULUTUSTYYPPI.AVOIN_YO,
      KOULUTUSTYYPPI.AVOIN_AMK,
      KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS,
      KOULUTUSTYYPPI.TAYDENNYS_KOULUTUS,
    ],
  },
  {
    section: 'alemmanKorkeakoulututkinnonOsaamisalat',
    koulutustyypit: TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
    parts: [
      {
        field: 'alemmanKorkeakoulututkinnonOsaamisalat',
        validate: (eb, values) =>
          eb.validateArray('alemmanKorkeakoulututkinnonOsaamisalat', eb => {
            const { tila } = values;
            const e = eb.validateUrl('linkki');

            return tila === JULKAISUTILA.JULKAISTU
              ? e.validateTranslations('nimi', getKielivalinta(values))
              : e;
          }),
      },
      {
        field: '.nimi',
        required: true,
      },
    ],
  },
  {
    section: 'ylemmanKorkeakoulututkinnonOsaamisalat',
    koulutustyypit: TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
    parts: [
      {
        field: 'ylemmanKorkeakoulututkinnonOsaamisalat',
        validate: (eb, values) =>
          eb.validateArray('ylemmanKorkeakoulututkinnonOsaamisalat', eb => {
            const { tila } = values;
            const e = eb.validateUrl('linkki');

            return tila === JULKAISUTILA.JULKAISTU
              ? e.validateTranslations('nimi', getKielivalinta(values))
              : e;
          }),
      },
      {
        field: '.nimi',
        required: true,
      },
    ],
  },
  {
    section: 'osaamisalat',
    koulutustyypit: TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
    field: 'osaamisalat',
    parts: [
      {
        field: '.osaamisalatGroup',
        required: true,
      },
      {
        field: '.osaamisalat',
      },
    ],
  },
  {
    section: 'jarjestamistiedot',
    koulutustyypit: KOULUTUSTYYPIT,
    field: 'jarjestamistiedot',
    parts: [
      {
        field: '.opetuskieli',
        validate: validateIfJulkaistu(eb =>
          eb.validateArrayMinLength('jarjestamistiedot.opetuskieli', 1)
        ),
        required: true,
      },
      createOptionalTranslatedFieldConfig({
        name: 'jarjestamistiedot.opetuskieliKuvaus',
      }),
      {
        field: '.suunniteltuKesto',
        required: true,
      },
      {
        field: '.suunniteltuKesto.vuotta',
        required: false,
        validate: validateIfJulkaistu(
          _.compose(
            validateInteger('jarjestamistiedot.suunniteltuKesto.vuotta', {
              min: 0,
              max: 99,
              optional: true,
            }),
            validateIfJulkaistu(
              validateExistence('jarjestamistiedot.suunniteltuKesto.vuotta')
            )
          )
        ),
      },
      {
        field: '.suunniteltuKesto.kuukautta',
        required: false,
        validate: _.compose(
          validateInteger('jarjestamistiedot.suunniteltuKesto.kuukautta', {
            min: 0,
            max: 11,
            optional: true,
          }),
          validateIfJulkaistu(
            validateExistence('jarjestamistiedot.suunniteltuKesto.kuukautta')
          )
        ),
      },
      createOptionalTranslatedFieldConfig({
        name: 'jarjestamistiedot.suunniteltuKestoKuvaus',
      }),
      {
        field: '.opetusaika',
        validate: validateIfJulkaistu(eb =>
          eb.validateArrayMinLength('jarjestamistiedot.opetusaika', 1)
        ),
        required: true,
      },
      createOptionalTranslatedFieldConfig({
        name: 'jarjestamistiedot.opetusaikaKuvaus',
      }),
      {
        field: '.opetustapa',
        validate: validateIfJulkaistu(eb =>
          eb.validateExistence('jarjestamistiedot.opetustapa')
        ),
        required: true,
      },
      createOptionalTranslatedFieldConfig({
        name: 'jarjestamistiedot.opetustapaKuvaus',
      }),
      {
        field: '.maksullisuus.tyyppi',
        validate: validateIfJulkaistu(eb =>
          eb.validateExistence('jarjestamistiedot.maksullisuus.tyyppi')
        ),
        required: true,
      },
      {
        field: '.maksullisuus.maksu',
        validate: validateIfJulkaistu((eb, values) =>
          values?.jarjestamistiedot?.maksullisuus?.tyyppi === 'kylla'
            ? eb.validateExistence('jarjestamistiedot.maksullisuus.maksu')
            : eb
        ),
      },
      createOptionalTranslatedFieldConfig({
        name: 'jarjestamistiedot.maksullisuusKuvaus',
      }),
      {
        field: '.onkoStipendia',
        required: true,
      },
      createOptionalTranslatedFieldConfig({
        name: 'jarjestamistiedot.stipendinKuvaus',
      }),
      {
        field: '.koulutuksenAlkamispaivaamara',
        validate: validateIfJulkaistu(eb =>
          eb.getValue('jarjestamistiedot.koulutuksenTarkkaAlkamisaika')
            ? eb.validateExistence(
                'jarjestamistiedot.koulutuksenAlkamispaivamaara'
              )
            : eb
        ),
      },
      {
        field: '.koulutuksenPaattymispaivamaara',
        validate: validateIfJulkaistu(eb =>
          eb.getValue('jarjestamistiedot.koulutuksenTarkkaAlkamisaika')
            ? eb.validateExistence(
                'jarjestamistiedot.koulutuksenPaattymispaivamaara'
              )
            : eb
        ),
        required: true,
      },
      {
        field: '.koulutuksenAlkamiskausi',
        validate: validateIfJulkaistu(eb =>
          !eb.getValue('jarjestamistiedot.koulutuksenTarkkaAlkamisaika')
            ? eb.validateExistence('jarjestamistiedot.koulutuksenAlkamiskausi')
            : eb
        ),
        required: true,
      },
      {
        field: '.koulutuksenAlkamisvuosi',
        validate: validateIfJulkaistu(eb =>
          !eb.getValue('jarjestamistiedot.koulutuksenTarkkaAlkamisaika')
            ? eb.validateExistence('jarjestamistiedot.koulutuksenAlkamisvuosi')
            : eb
        ),
      },
      {
        fragment: 'diplomi',
        koulutustyypit: [KOULUTUSTYYPPI.LUKIOKOULUTUS],
      },
      {
        fragment: 'kielivalikoima',
        koulutustyypit: [KOULUTUSTYYPPI.LUKIOKOULUTUS],
      },
    ],
  },
  {
    section: 'teemakuva',
    field: 'teemakuva',
    koulutustyypit: KOULUTUSTYYPIT,
  },
  {
    section: 'hakeutumisTaiIlmoittautumistapa',
    koulutustyypit: [KOULUTUSTYYPPI.TUTKINNON_OSA, KOULUTUSTYYPPI.OSAAMISALA],
    field: 'hakeutumisTaiIlmoittautumistapa',
  },
  {
    section: 'soraKuvaus',
    koulutustyypit: [KOULUTUSTYYPPI.TUTKINNON_OSA, KOULUTUSTYYPPI.OSAAMISALA],
    field: 'soraKuvaus',
  },
  {
    section: 'nayttamistiedot',
    koulutustyypit: KOULUTUSTYYPIT,
    field: 'nayttamistiedot',
  },
  {
    section: 'tarjoajat',
    field: 'tarjoajat',
    koulutustyypit: KOULUTUSTYYPIT,
    validate: validateIfJulkaistu(eb =>
      eb.validateArrayMinLength('tarjoajat', 1)
    ),
    required: true,
  },
  {
    section: 'yhteyshenkilot',
    field: 'yhteyshenkilot',
    koulutustyypit: KOULUTUSTYYPIT,
  },
  {
    koulutustyypit: KOULUTUSTYYPIT,
    section: 'tila',
    field: 'tila',
    required: true,
    validate: (eb, values) =>
      validateRelations([
        {
          key: 'koulutus',
          t: 'yleiset.koulutus',
        },
      ])(eb.validateExistence('tila'), values),
  },
]);

const getToteutusFormConfig = koulutustyyppi => {
  return config.getKoulutustyyppiConfig(koulutustyyppi);
};

export default getToteutusFormConfig;
