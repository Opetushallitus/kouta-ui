import _fp from 'lodash/fp';

import {
  Alkamiskausityyppi,
  HAKULOMAKETYYPPI,
  JULKAISUTILA,
} from '#/src/constants';
import { HakuFormValues } from '#/src/types/hakuTypes';
import createErrorBuilder, {
  validate,
  validateArray,
  validateArrayMinLength,
  validateExistence,
  validateExistenceOfDate,
  validateTranslations,
  validateArchiveDate,
} from '#/src/utils/form/createErrorBuilder';
import {
  getKielivalinta,
  validateIf,
  validateOptionalTranslatedField,
  validatePohja,
  validateYhteyshenkilo,
} from '#/src/utils/form/formConfigUtils';
import isErillishakuHakutapa from '#/src/utils/isErillishakuHakutapa';
import isYhteishakuHakutapa from '#/src/utils/isYhteishakuHakutapa';
const getHakutapa = values => values?.hakutapa;

const validateHakuForm = (values: HakuFormValues, registeredFields) => {
  const { tila } = values;
  const isJulkaistu = tila === JULKAISUTILA.JULKAISTU;

  const hakutapa = getHakutapa(values);
  const isErillishaku = isErillishakuHakutapa(hakutapa);
  const isYhteishaku = isYhteishakuHakutapa(hakutapa);
  const kieliversiot = getKielivalinta(values);

  const hakulomaketyyppi = values?.hakulomake?.tyyppi;
  const arkistointiHaunPaattymisestaKk = 3;

  return _fp
    .flow(
      validatePohja,
      validateExistence('organisaatioOid'),
      validateExistence('tila'),
      validateArrayMinLength('kieliversiot', 1),
      validateTranslations('nimi'),
      validateExistence('hakutapa'),
      validateExistence('kohdejoukko.kohdejoukko'),
      validateArray('yhteyshenkilot', validateYhteyshenkilo(kieliversiot)),
      validateIf(
        isJulkaistu,
        _fp.flow(
          validateIf(
            isYhteishaku,
            validate('aikataulut.ajankohtaKaytossa', v => v === true, {
              message:
                'validointivirheet.pakollinenAjankohtaJosJulkaistuYhteishaku',
            }),
            validateExistence('aikataulut.ajankohtaTyyppi', {
              message:
                'validointivirheet.pakollinenAjankohtaJosJulkaistuYhteishaku',
            })
          ),
          validateIf(
            values?.aikataulut?.ajankohtaKaytossa &&
              values?.aikataulut?.ajankohtaTyyppi ===
                Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI,
            _fp.flow(
              validateExistence('aikataulut.kausi'),
              validateExistence('aikataulut.vuosi')
            )
          ),
          validateIf(
            values?.aikataulut?.ajankohtaKaytossa &&
              values?.aikataulut?.ajankohtaTyyppi ===
                Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA,
            validateExistenceOfDate('aikataulut.tarkkaAlkaa')
          ),
          validateArrayMinLength('aikataulut.hakuaika', 1, {
            isFieldArray: true,
          }),
          validateArray(
            'aikataulut.hakuaika',
            _fp.flow(
              validateExistenceOfDate('alkaa'),
              validateIf(
                isYhteishaku || isErillishaku,
                validateExistenceOfDate('paattyy')
              )
            )
          ),
          validateOptionalTranslatedField(
            'aikataulut.henkilokohtaisenSuunnitelmanLisatiedot'
          ),
          validateExistence('hakulomake.tyyppi'),
          validateIf(
            hakulomaketyyppi === HAKULOMAKETYYPPI.ATARU,
            validateExistence('hakulomake.lomake')
          ),
          validateIf(
            hakulomaketyyppi === HAKULOMAKETYYPPI.MUU,
            validateTranslations('hakulomake.linkki')
          ),
          validateIf(
            values?.aikataulut?.ajastettuHaunJaHakukohteidenArkistointi &&
              values?.aikataulut?.hakuaika.map(h => h.paattyy),
            validateArchiveDate('aikataulut', arkistointiHaunPaattymisestaKk)
          )
        )
      )
    )(createErrorBuilder(values, kieliversiot, registeredFields))
    .getErrors();
};

export default validateHakuForm;
