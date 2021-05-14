import _fp from 'lodash/fp';

import { Alkamiskausityyppi, LIITTEEN_TOIMITUSTAPA } from '#/src/constants';

import createErrorBuilder, {
  validateArray,
  validateArrayMinLength,
  validateExistence,
  validateExistenceOfDate,
  validateTranslations,
} from '../form/createErrorBuilder';
import {
  getKielivalinta,
  validateIf,
  validateIfConditionAndJulkaistu,
  validateIfJulkaistu,
  validateOptionalTranslatedField,
  validateRelations,
  validateValintakokeet,
} from '../form/formConfigUtils';

const validateLiitteet = errorBuilder => {
  const values = errorBuilder.getValues();
  const yhteinenToimitusaika = values?.liitteet?.yhteinenToimitusaika;
  const yhteinenToimitusosoite = values?.liitteet?.yhteinenToimituspaikka;

  return _fp.flow(
    validateIf(
      yhteinenToimitusaika,
      validateExistence('liitteet.toimitusaika')
    ),
    validateIf(
      yhteinenToimitusosoite,
      validateExistence('liitteet.toimitustapa.tapa')
    ),
    validateIf(
      yhteinenToimitusosoite &&
        values?.liitteet?.toimitustapa?.tapa ===
          LIITTEEN_TOIMITUSTAPA.MUU_OSOITE,
      validateTranslations('liitteet.toimitustapa.paikka.osoite'),
      validateExistence('liitteet.toimitustapa.paikka.postinumero'),
      validateExistence('liitteet.toimitustapa.paikka.sahkoposti')
    ),
    validateArray('liitteet.liitteet', (liitteetEb, liite) =>
      _fp.flow([
        validateExistence('tyyppi'),
        validateTranslations('nimi'),
        validateOptionalTranslatedField('kuvaus'),
        validateIf(!yhteinenToimitusaika, validateExistence('toimitusaika')),
        validateIf(
          !yhteinenToimitusosoite,
          validateExistence('toimitustapa.tapa')
        ),
        validateIf(
          !yhteinenToimitusosoite &&
            liite?.toimitustapa?.tapa === LIITTEEN_TOIMITUSTAPA.MUU_OSOITE,
          validateTranslations('toimitustapa.paikka.osoite'),
          validateExistence('toimitustapa.paikka.postinumero'),
          validateExistence('toimitustapa.paikka.sahkoposti')
        ),
      ])(liitteetEb)
    )
  )(errorBuilder);
};

export const validateHakukohdeForm = (values, registeredFields) => {
  const kieliversiot = getKielivalinta(values);
  return _fp
    .flow(
      validateExistence('tila'),
      validateArrayMinLength('kieliversiot', 1),
      validateTranslations('perustiedot.nimi'),
      validateIfJulkaistu(
        validateArrayMinLength('pohjakoulutus.pohjakoulutusvaatimus', 1)
      ),
      validateIfConditionAndJulkaistu(
        values?.hakuajat?.eriHakuaika,
        validateArrayMinLength('hakuajat.hakuajat', 1, {
          isFieldArray: true,
        }),
        validateArray('hakuajat.hakuajat', eb => eb.validateExistence('alkaa'))
      ),
      validateIfConditionAndJulkaistu(
        values?.ajankohta?.kaytetaanHakukohteenAlkamiskautta,
        validateExistence('ajankohta.ajankohtaTyyppi')
      ),
      validateIfConditionAndJulkaistu(
        values?.ajankohta?.kaytetaanHakukohteenAlkamiskautta &&
          values?.ajankohta?.ajankohtaTyyppi ===
            Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI,
        validateExistence('ajankohta.kausi'),
        validateExistence('ajankohta.vuosi')
      ),
      validateIfConditionAndJulkaistu(
        values?.ajankohta?.kaytetaanHakukohteenAlkamiskautta &&
          values?.ajankohta?.ajankohtaTyyppi ===
            Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA,
        validateExistenceOfDate('ajankohta.tarkkaAlkaa')
      ),
      validateOptionalTranslatedField('aloituspaikat.aloituspaikkakuvaus'),
      validateIfJulkaistu(validateValintakokeet),
      validateIfJulkaistu(validateLiitteet),
      validateIfJulkaistu(validateExistence('jarjestyspaikkaOid')),
      validateRelations([
        { key: 'haku', t: 'yleiset.haku' },
        { key: 'toteutus', t: 'yleiset.toteutus' },
        { key: 'valintaperuste', t: 'yleiset.valintaperuste' },
      ])
    )(createErrorBuilder(values, kieliversiot, registeredFields))
    .getErrors();
};
