import _fp from 'lodash/fp';

import {
  Alkamiskausityyppi,
  ApurahaMaaraTyyppi,
  ApurahaYksikko,
  HAKULOMAKETYYPPI,
  JULKAISUTILA,
  KOULUTUSTYYPIT,
  KOULUTUSTYYPPI,
  TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
  //TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT,
} from '#/src/constants';
import {
  ToteutusFormValues,
  MaksullisuusTyyppi,
} from '#/src/types/toteutusTypes';
import {
  validate,
  validateExistence,
  validateExistenceOfDate,
  validateInteger,
  validateTranslations,
  validateUrl,
} from '#/src/utils/form/createErrorBuilder';
import createFormConfigBuilder from '#/src/utils/form/createFormConfigBuilder';
import {
  createOptionalTranslatedFieldConfig,
  getKielivalinta,
  kieliversiotSectionConfig,
  pohjaValintaSectionConfig,
  validateIf,
  validateIfJulkaistu,
  validateRelations,
} from '#/src/utils/form/formConfigUtils';

import { isApurahaVisible } from './toteutusVisibilities';

const validateDateTimeRange = (alkaaFieldName, paattyyFieldName) => (
  eb,
  values
) => {
  const alkaaValue = _fp.get(alkaaFieldName, values);
  const paattyyValue = _fp.get(paattyyFieldName, values);
  return _fp.flow(
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

const validateApuraha = (eb, values) => {
  const apurahaMin = _fp.parseInt(10, values?.jarjestamistiedot?.apurahaMin);
  const apurahaMax = _fp.parseInt(10, values?.jarjestamistiedot?.apurahaMax);
  const onkoApuraha = values?.jarjestamistiedot?.onkoApuraha;
  const apurahaMaaraTyyppi = values?.jarjestamistiedot?.apurahaMaaraTyyppi;
  const apurahaYksikko = values?.jarjestamistiedot?.apurahaYksikko?.value;

  return validateIf(
    onkoApuraha &&
      isApurahaVisible(
        values?.koulutustyyppi,
        values?.jarjestamistiedot.opetuskieli
      ),
    _fp.flow(
      validate('jarjestamistiedot.apurahaGroup', () => apurahaMin >= 0, {
        message: ['validointivirheet.eiNegatiivinenKokonaisluku'],
      }),
      validate(
        'jarjestamistiedot.apurahaGroup',
        () =>
          apurahaYksikko === ApurahaYksikko.PROSENTTI
            ? apurahaMin <= 100
            : true,
        {
          message: 'validointivirheet.yliSataProsenttia',
        }
      ),
      validateIf(
        apurahaMaaraTyyppi === ApurahaMaaraTyyppi.VAIHTELUVALI,
        _fp.flow(
          validate('jarjestamistiedot.apurahaGroup', () => apurahaMax >= 0, {
            message: ['validointivirheet.eiNegatiivinenKokonaisluku'],
          }),
          validate(
            'jarjestamistiedot.apurahaGroup',
            () => apurahaMin <= apurahaMax,
            {
              message: 'validointivirheet.apurahaMinMax',
            }
          ),
          validate(
            'jarjestamistiedot.apurahaGroup',
            () =>
              apurahaYksikko === ApurahaYksikko.PROSENTTI
                ? apurahaMax <= 100
                : true,
            {
              message: 'validointivirheet.yliSataProsenttia',
            }
          )
        )
      )
    )
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
        koulutustyypit: TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
        field: '.ammatillinenPerustutkintoErityisopetuksena',
      },
      createOptionalTranslatedFieldConfig({
        name: 'kuvaus',
        koulutustyypit: _fp.without(
          [KOULUTUSTYYPPI.LUKIOKOULUTUS],
          KOULUTUSTYYPIT
        ),
      }),
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
  // NOTE: Korkeakoulu osaamisalat hidden for now (KTO-286, KTO-1175). Will probably be removed later.
  /*{
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
  },*/
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
        validate: _fp.flow(
          validateIfJulkaistu(
            validateExistence('jarjestamistiedot.suunniteltuKesto.vuotta')
          ),
          validateInteger('jarjestamistiedot.suunniteltuKesto.vuotta', {
            min: 0,
            max: 99,
            optional: true,
          })
        ),
      },
      {
        field: '.suunniteltuKesto.kuukautta',
        required: false,
        validate: _fp.flow(
          validateIfJulkaistu(
            validateExistence('jarjestamistiedot.suunniteltuKesto.kuukautta')
          ),
          validateInteger('jarjestamistiedot.suunniteltuKesto.kuukautta', {
            min: 0,
            max: 11,
            optional: true,
          })
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
        field: '.maksullisuustyyppi',
        required: true,
      },
      {
        field: '.maksunMaara',
        validate: eb =>
          validateIf(
            eb.getValues()?.jarjestamistiedot?.maksullisuustyyppi !==
              MaksullisuusTyyppi.MAKSUTON,
            validateInteger(
              'jarjestamistiedot.maksunMaara',
              { min: 1 },
              'validointivirheet.eiNegatiivinenKokonaisluku'
            )
          )(eb),
      },
      createOptionalTranslatedFieldConfig({
        name: 'jarjestamistiedot.maksullisuusKuvaus',
      }),
      {
        field: '.apurahaTyyppi',
      },
      {
        field: '.apurahaYksikko',
      },
      {
        field: '.apurahaGroup',
        validate: validateApuraha,
      },
      {
        field: '.apurahaMin',
      },
      {
        field: '.apurahaMax',
      },
      createOptionalTranslatedFieldConfig({
        name: 'jarjestamistiedot.apurahaKuvaus',
      }),
      {
        field: '.ajankohta.ajankohtaTyyppi',
      },
      {
        field: '.ajankohta.kausi',
      },
      {
        field: '.ajankohta.vuosi',
        validate: (eb, values: ToteutusFormValues) =>
          validateIf(
            values?.jarjestamistiedot?.ajankohta?.ajankohtaKaytossa &&
              values?.jarjestamistiedot?.ajankohta?.ajankohtaTyyppi ===
                Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI &&
              values?.tila === JULKAISUTILA.JULKAISTU,
            _fp.flow(
              validateExistence('jarjestamistiedot.ajankohta.kausi'),
              validateExistence('jarjestamistiedot.ajankohta.vuosi')
            )
          )(eb),
      },
      {
        field: '.ajankohta.tarkkaAlkaa',
        required: true,
        validate: (eb, values: ToteutusFormValues) =>
          validateIf(
            eb?.values?.jarjestamistiedot?.ajankohta?.ajankohtaKaytossa &&
              values?.jarjestamistiedot?.ajankohta?.ajankohtaTyyppi ===
                Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA &&
              values?.tila === JULKAISUTILA.JULKAISTU,
            validateExistenceOfDate('jarjestamistiedot.ajankohta.tarkkaAlkaa')
          )(eb),
      },
      {
        field: '.ajankohta.tarkkaPaattyy',
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
      _fp.flow(
        eb =>
          validateDateTimeRange(
            'hakeutumisTaiIlmoittautumistapa.hakuaikaAlkaa',
            'hakeutumisTaiIlmoittautumistapa.hakuaikaPaattyy'
          )(eb, values),
        validateIf(values?.tila === JULKAISUTILA.JULKAISTU, eb => {
          const hakeutumisTaiIlmoittautumistapa =
            values?.hakeutumisTaiIlmoittautumistapa
              ?.hakeutumisTaiIlmoittautumistapa;
          return _fp.flow(
            validateExistence('hakeutumisTaiIlmoittautumistapa.hakuTapa'),
            validateExistence(
              'hakeutumisTaiIlmoittautumistapa.hakeutumisTaiIlmoittautumistapa'
            ),
            validateIf(
              hakeutumisTaiIlmoittautumistapa === HAKULOMAKETYYPPI.MUU,
              _fp.flow(
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
        // Note that this is different from hakutapa in haku-form
        // Value can be 'hakeutuminen' or 'ilmoittautuminen'
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
  {
    section: 'esikatselu',
    field: 'esikatselu',
    koulutustyypit: KOULUTUSTYYPIT,
  },
]);

const getToteutusFormConfig = koulutustyyppi => {
  return config.getConfig(koulutustyyppi);
};

export default getToteutusFormConfig;
