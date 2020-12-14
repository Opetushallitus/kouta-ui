import _fp from 'lodash/fp';

import createFormConfigBuilder from '#/src/utils/form/createFormConfigBuilder';

import {
  validateExistence,
  validateInteger,
  validateExistenceOfDate,
  validate,
  validateTranslations,
  validateUrl,
} from '#/src/utils/form/createErrorBuilder';

import {
  KOULUTUSTYYPPI,
  KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT,
  JULKAISUTILA,
  HAKULOMAKETYYPPI,
  TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT,
} from '#/src/constants';

import {
  validateIfJulkaistu,
  getKielivalinta,
  kieliversiotSectionConfig,
  pohjaValintaSectionConfig,
  validateRelations,
  createOptionalTranslatedFieldConfig,
  validateIf,
} from '#/src/utils/form/formConfigUtils';

const validateDateTimeRange = (alkaaFieldName, paattyyFieldName) => (
  eb,
  values
) => {
  const alkaaValue = _fp.get(alkaaFieldName, values);
  const paattyyValue = _fp.get(paattyyFieldName, values);
  return _fp.pipe(
    eb =>
      paattyyValue
        ? validateExistenceOfDate(alkaaFieldName, {
            message: 'validointivirheet.pakollinenAlkamisaikaJosPaattymisaika',
          })(eb)
        : eb,
    eb =>
      alkaaValue && paattyyValue
        ? validate(alkaaFieldName, () => alkaaValue < paattyyValue, {
            message: 'validointivirheet.alkamisaikaEnnenPaattymisaikaa',
          })(eb)
        : eb
  )(eb);
};

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
        koulutustyypit: _fp.without(
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
        koulutustyypit: _fp.without(
          [KOULUTUSTYYPPI.OSAAMISALA, KOULUTUSTYYPPI.TUTKINNON_OSA],
          TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT
        ),
      },
      {
        field: '.laajuus',
        koulutustyypit: _fp.without(
          [KOULUTUSTYYPPI.OSAAMISALA, KOULUTUSTYYPPI.TUTKINNON_OSA],
          TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT
        ),
      },
      {
        field: '.laajuusyksikko',
        koulutustyypit: _fp.without(
          [KOULUTUSTYYPPI.OSAAMISALA, KOULUTUSTYYPPI.TUTKINNON_OSA],
          TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT
        ),
      },
      {
        field: '.aloituspaikat',
        koulutustyypit: _fp.without(
          [
            KOULUTUSTYYPPI.VALMA,
            KOULUTUSTYYPPI.TELMA,
            KOULUTUSTYYPPI.LUVA,
            KOULUTUSTYYPPI.PERUSOPETUKSEN_LISAOPETUS,
          ],
          TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT
        ),
        validate: validateInteger(
          'tiedot.aloituspaikat',
          {
            min: 1,
            optional: true,
          },
          'validointivirheet.positiivinenKokonaisluku'
        ),
      },
    ],
  },
  {
    section: 'kuvaus',
    parts: [
      createOptionalTranslatedFieldConfig({
        name: 'kuvaus',
        koulutustyypit: _fp.without(
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
          _fp.compose(
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
        validate: _fp.compose(
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
        field: '.koulutuksenAlkamispaivamaara',
        validate: (eb, values) =>
          validateIf(
            values?.jarjestamistiedot?.koulutuksenTarkkaAlkamisaika,
            validateDateTimeRange(
              'jarjestamistiedot.koulutuksenAlkamispaivamaara',
              'jarjestamistiedot.koulutuksenPaattymispaivamaara'
            )
          )(eb),
        required: true,
      },
      {
        field: '.koulutuksenPaattymispaivamaara',
        validate: validateIfJulkaistu(eb =>
          eb.getValue('jarjestamistiedot.koulutuksenTarkkaAlkamisaika')
            ? eb
                .validateExistence(
                  'jarjestamistiedot.koulutuksenAlkamispaivamaara'
                )
                .validateExistence(
                  'jarjestamistiedot.koulutuksenPaattymispaivamaara'
                )
            : eb
        ),
        required: true,
      },
      {
        field: '.koulutuksenAlkamiskausi',
      },
      {
        field: '.koulutuksenAlkamisvuosi',
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
    validate: (eb, values) =>
      _fp.pipe(
        eb =>
          validateDateTimeRange(
            'hakeutumisTaiIlmoittautumistapa.hakuaikaAlkaa',
            'hakeutumisTaiIlmoittautumistapa.hakuaikaPaattyy'
          )(eb, values),
        validateIf(values?.tila === JULKAISUTILA.JULKAISTU, eb => {
          const hakeutumisTaiIlmoittautumistapa =
            values?.hakeutumisTaiIlmoittautumistapa
              ?.hakeutumisTaiIlmoittautumistapa;
          return _fp.pipe(
            validateExistence('hakeutumisTaiIlmoittautumistapa.hakuTapa'),
            validateExistence(
              'hakeutumisTaiIlmoittautumistapa.hakeutumisTaiIlmoittautumistapa'
            ),
            validateIf(
              hakeutumisTaiIlmoittautumistapa === HAKULOMAKETYYPPI.MUU,
              _fp.pipe(
                validateUrl(
                  'hakeutumisTaiIlmoittautumistapa.linkki',
                  getKielivalinta(values)
                ),
                validateTranslations(
                  'hakeutumisTaiIlmoittautumistapa.lisatiedotValintaperusteista',
                  getKielivalinta(values),
                  { optional: true }
                ),
                validateExistenceOfDate(
                  'hakeutumisTaiIlmoittautumistapa.hakuaikaAlkaa'
                ),
                validateIf(
                  ![
                    KOULUTUSTYYPPI.TUTKINNON_OSA,
                    KOULUTUSTYYPPI.OSAAMISALA,
                  ].includes(values.koulutustyyppi),
                  validateExistenceOfDate(
                    'hakeutumisTaiIlmoittautumistapa.hakuaikaPaattyy'
                  )
                )
              )
            ),
            validateIf(
              [
                HAKULOMAKETYYPPI.MUU,
                HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA,
              ].includes(hakeutumisTaiIlmoittautumistapa),
              validateTranslations(
                'hakeutumisTaiIlmoittautumistapa.lisatiedot',
                getKielivalinta(values),
                { optional: true }
              )
            )
          )(eb);
        })
      )(eb),
    parts: [
      {
        field: '.hakuTapa',
        required: true,
      },
      {
        field: '.hakeutumisTaiIlmoittautumistapa',
        required: true,
      },
      {
        field: '.linkki',
        required: true,
      },
      {
        field: '.lisatiedot',
      },
      {
        field: '.lisatiedotValintaperusteista',
      },
      {
        field: '.hakuaikaAlkaa',
      },
      {
        field: '.hakuaikaPaattyy',
      },
    ],
  },
  {
    section: 'soraKuvaus',
    koulutustyypit: [KOULUTUSTYYPPI.TUTKINNON_OSA, KOULUTUSTYYPPI.OSAAMISALA],
    field: 'soraKuvaus',
  },
  {
    section: 'nayttamistiedot',
    koulutustyypit: KOULUTUSTYYPIT,
    parts: [
      {
        koulutustyypit: [
          ...TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT,
          KOULUTUSTYYPPI.AVOIN_YO,
          KOULUTUSTYYPPI.AVOIN_AMK,
          KOULUTUSTYYPPI.TAYDENNYS_KOULUTUS,
          KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS,
          KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO,
        ],
        field: '.ammattinimikkeet',
      },
      {
        field: '.avainsanat',
      },
    ],
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
        {
          key: 'soraKuvaus',
          t: 'yleiset.soraKuvaus',
        },
      ])(eb.validateExistence('tila'), values),
  },
]);

const getToteutusFormConfig = koulutustyyppi => {
  return config.getKoulutustyyppiConfig(koulutustyyppi);
};

export default getToteutusFormConfig;
