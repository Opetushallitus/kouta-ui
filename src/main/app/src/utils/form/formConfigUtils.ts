import _fp from 'lodash/fp';

import { JULKAISUTILA, POHJAVALINTA } from '#/src/constants';
import {
  validateArray,
  validateExistence,
  validateTranslations,
} from '#/src/utils/form/createErrorBuilder';

export const crossCheckWwwSivu = kieliversiot => eb => {
  const values = eb.getValues();
  const wwwSivuUrl = _fp.get('perustiedot.wwwSivuUrl', values);
  const wwwSivuNimi = _fp.get('perustiedot.wwwSivuNimi', values);
  return _fp.flow(
    ...kieliversiot.map(kieli =>
      _fp.flow(
        validateIf(
          !wwwSivuUrl?.[kieli] && wwwSivuNimi?.[kieli],
          validateTranslations('perustiedot.wwwSivuUrl', kieliversiot, {
            message: 'validointivirheet.pakollinen',
          })
        ),
        validateIf(
          wwwSivuUrl?.[kieli] && !wwwSivuNimi?.[kieli],
          validateTranslations('perustiedot.wwwSivuNimi', kieliversiot, {
            message: 'validointivirheet.pakollinen',
          })
        )
      )
    )
  )(eb);
};

export const validateIfJulkaistu =
  (...validateFns) =>
  eb => {
    const { tila } = eb.getValues();
    return tila === JULKAISUTILA.JULKAISTU ? _fp.flow(...validateFns)(eb) : eb;
  };

export const validateIf =
  (condition, ...validateFns) =>
  eb =>
    condition ? _fp.flow(...validateFns)(eb) : eb;

export const validateValintakokeet = errorBuilder => {
  const values = errorBuilder.getValues();
  const kieliversiot = getKielivalinta(values);
  return _fp.flow(
    validateTranslations('valintakokeet.yleisKuvaus', kieliversiot, {
      optional: true,
    }),
    validateArray(
      'valintakokeet.kokeetTaiLisanaytot',
      (eb, { liittyyEnnakkovalmistautumista, erityisjarjestelytMahdollisia }) =>
        _fp.flow(
          validateExistence('tyyppi'),
          validateIf(
            liittyyEnnakkovalmistautumista,
            validateTranslations('ohjeetEnnakkovalmistautumiseen', kieliversiot)
          ),
          validateIf(
            erityisjarjestelytMahdollisia,
            validateTranslations('ohjeetErityisjarjestelyihin', kieliversiot, {
              optional: true,
            })
          ),
          validateTranslations('nimi', kieliversiot, { optional: true }),
          validateTranslations('tietoaHakijalle', kieliversiot, {
            optional: true,
          }),
          validateArray(
            'tilaisuudet',
            _fp.flow(
              validateTranslations('osoite', kieliversiot),
              validateExistence('postinumero'),
              validateExistence('alkaa'),
              validateExistence('paattyy'),
              validateTranslations('jarjestamispaikka', kieliversiot, {
                optional: true,
              }),
              validateTranslations('lisatietoja', kieliversiot, {
                optional: true,
              })
            )
          )
        )(eb)
    )
  )(errorBuilder);
};

export const getKielivalinta = values =>
  _fp.get('kieliversiot', values) ||
  _fp.get('perustiedot.kieliversiot', values) ||
  [];

export const validateOptionalTranslatedField = name =>
  validateIfJulkaistu(eb =>
    eb.validateTranslations(name, getKielivalinta(eb.getValues()), {
      optional: true,
    })
  );

export const validatePohja = eb =>
  validateIf(
    eb.getValues()?.pohja?.tapa === POHJAVALINTA.KOPIO,
    validateExistence('pohja.valinta')
  )(eb);

export const validateYhteyshenkilo =
  kieliversiot =>
  (eb, { verkkosivu, verkkosivuTeksti }) =>
    _fp.flow(
      ...(kieliversiot ?? []).map(kieli =>
        _fp.flow(
          validateTranslations('nimi'),
          validateIf(
            verkkosivu?.[kieli] && !verkkosivuTeksti?.[kieli],
            validateTranslations('verkkosivuTeksti', kieliversiot, {
              message: 'validointivirheet.pakollinen',
            })
          ),
          validateIf(
            !verkkosivu?.[kieli] && verkkosivuTeksti?.[kieli],
            validateTranslations('verkkosivu', kieliversiot, {
              message: 'validointivirheet.pakollinen',
            })
          )
        )
      )
    )(eb);
