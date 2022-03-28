import _fp from 'lodash/fp';

import {
  Alkamiskausityyppi,
  KOULUTUSTYYPPI,
  LIITTEEN_TOIMITUSTAPA,
} from '#/src/constants';

import createErrorBuilder, {
  validateArray,
  validateArrayMinLength,
  validateExistence,
  validateExistenceOfDate,
  validateTranslations,
  validateInteger,
} from '../form/createErrorBuilder';
import {
  getKielivalinta,
  validateIf,
  validateIfJulkaistu,
  validateOptionalTranslatedField,
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
      validateTranslations('liitteet.toimitustapa.paikka.osoite.rivi1'),
      validateExistence('liitteet.toimitustapa.paikka.postinumero')
    ),
    validateArray('liitteet.liitteet', (liitteetEb, liite) => {
      return _fp.flow([
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
          validateTranslations('toimitustapa.paikka.osoite.rivi1'),
          validateExistence('toimitustapa.paikka.postinumero')
        ),
      ])(liitteetEb);
    })
  )(errorBuilder);
};

export const validateHakukohdeForm =
  koulutustyyppi => (values, registeredFields) => {
    const kieliversiot = getKielivalinta(values);

    return _fp
      .flow(
        validateExistence('tila'),
        validateArrayMinLength('kieliversiot', 1),
        validateTranslations('perustiedot.nimi'),
        // Lukio-hakukohteen nimi luodaan hakukohteen linjan perusteella, joten se on pakko olla
        validateIf(
          koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS,
          validateExistence('hakukohteenLinja.linja')
        ),
        validateIfJulkaistu(
          validateInteger('aloituspaikat.aloituspaikkamaara', { min: 0 }),
          validateIf(
            values?.aloituspaikat?.ensikertalaismaara,
            validateInteger('aloituspaikat.ensikertalaismaara', { min: 0 })
          ),
          validateOptionalTranslatedField('aloituspaikat.aloituspaikkakuvaus'),
          validateArrayMinLength('pohjakoulutus.pohjakoulutusvaatimus', 1),
          validateValintakokeet,
          validateLiitteet,
          validateExistence('jarjestyspaikkaOid'),
          validateIf(
            values?.hakuajat?.eriHakuaika,
            validateArrayMinLength('hakuajat.hakuajat', 1, {
              isFieldArray: true,
            }),
            validateArray('hakuajat.hakuajat', eb =>
              eb.validateExistence('alkaa')
            )
          ),
          validateIf(
            values?.ajankohta?.kaytetaanHakukohteenAlkamiskautta,
            validateExistence('ajankohta.ajankohtaTyyppi')
          ),
          validateIf(
            values?.ajankohta?.kaytetaanHakukohteenAlkamiskautta &&
              values?.ajankohta?.ajankohtaTyyppi ===
                Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI,
            validateExistence('ajankohta.kausi'),
            validateExistence('ajankohta.vuosi')
          ),
          validateIf(
            values?.ajankohta?.kaytetaanHakukohteenAlkamiskautta &&
              values?.ajankohta?.ajankohtaTyyppi ===
                Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA,
            validateExistenceOfDate('ajankohta.tarkkaAlkaa')
          )
        )
      )(createErrorBuilder(values, kieliversiot, registeredFields))
      .getErrors();
  };
