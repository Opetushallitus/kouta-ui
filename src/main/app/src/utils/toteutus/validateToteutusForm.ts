import _fp from 'lodash/fp';

import {
  Alkamiskausityyppi,
  MaaraTyyppi,
  ApurahaYksikko,
  HAKULOMAKETYYPPI,
  JULKAISUTILA,
  KOULUTUSTYYPPI,
} from '#/src/constants';
import { ToteutusFormValues } from '#/src/types/toteutusTypes';
import createErrorBuilder, {
  validate,
  validateArrayMinLength,
  validateExistence,
  validateExistenceOfDate,
  validateInteger,
  validateTranslations,
  validateUrl,
} from '#/src/utils/form/createErrorBuilder';
import {
  getKielivalinta,
  validateIf,
  validateOptionalTranslatedField,
  validatePohja,
} from '#/src/utils/form/formConfigUtils';

import { isApurahaVisible } from './toteutusVisibilities';

const validateDateTimeRange =
  (alkaaFieldName, paattyyFieldName) => (eb, values) => {
    const alkaaValue = _fp.get(alkaaFieldName, values);
    const paattyyValue = _fp.get(paattyyFieldName, values);
    return _fp.flow(
      eb =>
        paattyyValue
          ? validateExistenceOfDate(alkaaFieldName, {
              message:
                'validointivirheet.pakollinenAlkamisaikaJosPaattymisaika',
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

const validateApuraha = eb => {
  const values = eb.values;
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
        apurahaMaaraTyyppi === MaaraTyyppi.VAIHTELUVALI,
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

const validateHakeutumisTaiIlmoittautumisTapa = eb => {
  const values = eb.values;
  const hakeutumisTaiIlmoittautumistapa =
    values?.hakeutumisTaiIlmoittautumistapa?.hakeutumisTaiIlmoittautumistapa;
  return _fp.flow(
    eb =>
      validateDateTimeRange(
        'hakeutumisTaiIlmoittautumistapa.hakuaikaAlkaa',
        'hakeutumisTaiIlmoittautumistapa.hakuaikaPaattyy'
      )(eb, values),
    validateIf(
      values?.tila === JULKAISUTILA.JULKAISTU,
      _fp.flow(
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
          [HAKULOMAKETYYPPI.MUU, HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA].includes(
            hakeutumisTaiIlmoittautumistapa
          ),
          validateTranslations(
            'hakeutumisTaiIlmoittautumistapa.lisatiedot',
            getKielivalinta(values),
            { optional: true }
          )
        )
      )
    )
  )(eb);
};

export const validateToteutusForm = (
  values: ToteutusFormValues,
  registeredFields
) => {
  const { tila } = values;
  const isJulkaistu = tila === JULKAISUTILA.JULKAISTU;
  const kieliversiot = getKielivalinta(values);

  // NOTE: Only registered fields will be validated!
  return _fp
    .flow(
      validatePohja,
      validateExistence('organisaatioOid'),
      validateExistence('tila'),
      validateArrayMinLength('kieliversiot', 1),
      validateTranslations('tiedot.nimi'),
      validateOptionalTranslatedField('kuvaus'),
      validateInteger(
        'tiedot.aloituspaikat',
        {
          min: 1,
          optional: true,
        },
        'validointivirheet.positiivinenKokonaisluku'
      ),
      validateExistence('lukiolinjat.lukiolinja'),
      validateOptionalTranslatedField('jarjestamistiedot.opetuskieliKuvaus'),
      validateOptionalTranslatedField(
        'jarjestamistiedot.suunniteltuKestoKuvaus'
      ),
      validateOptionalTranslatedField('jarjestamistiedot.opetusaikaKuvaus'),
      validateOptionalTranslatedField('jarjestamistiedot.opetustapaKuvaus'),
      validateOptionalTranslatedField('jarjestamistiedot.maksullisuusKuvaus'),
      validateApuraha,
      validateOptionalTranslatedField('jarjestamistiedot.apurahaKuvaus'),
      validateHakeutumisTaiIlmoittautumisTapa,
      validateInteger('jarjestamistiedot.suunniteltuKesto.vuotta', {
        min: 0,
        max: 99,
        optional: true,
      }),
      validateInteger('jarjestamistiedot.suunniteltuKesto.kuukautta', {
        min: 0,
        max: 11,
        optional: true,
      }),
      validateIf(
        isJulkaistu,
        _fp.flow(
          validateArrayMinLength('jarjestamistiedot.opetuskieli', 1),
          validateExistence('jarjestamistiedot.suunniteltuKesto.vuotta'),
          validateExistence('jarjestamistiedot.suunniteltuKesto.kuukautta'),
          validateArrayMinLength('jarjestamistiedot.opetusaika', 1),
          validateArrayMinLength('jarjestamistiedot.opetustapa', 1),
          validateIf(
            values?.jarjestamistiedot?.ajankohta?.ajankohtaKaytossa &&
              values?.jarjestamistiedot?.ajankohta?.ajankohtaTyyppi ===
                Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI,
            _fp.flow(
              validateExistence('jarjestamistiedot.ajankohta.kausi'),
              validateExistence('jarjestamistiedot.ajankohta.vuosi')
            )
          ),
          validateIf(
            values?.jarjestamistiedot?.ajankohta?.ajankohtaKaytossa &&
              values?.jarjestamistiedot?.ajankohta?.ajankohtaTyyppi ===
                Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA,
            validateExistenceOfDate('jarjestamistiedot.ajankohta.tarkkaAlkaa')
          ),
          validateArrayMinLength('tarjoajat', 1)
        )
      )
    )(createErrorBuilder(values, kieliversiot, registeredFields))
    .getErrors();
};
