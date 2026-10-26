import { flow, get } from 'lodash-es';

import { JULKAISUTILA, POHJAVALINTA } from '#/src/constants';
import {
  validateArray,
  validateExistence,
  validateTranslations,
} from '#/src/utils/form/createErrorBuilder';

export const crossCheckWwwSivu = kieliversiot => eb => {
  const values = eb.getValues();
  const wwwSivuUrl = get(values, 'perustiedot.wwwSivuUrl');
  const wwwSivuNimi = get(values, 'perustiedot.wwwSivuNimi');
  return flow(
    ...kieliversiot.map(kieli =>
      flow(
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
    return tila === JULKAISUTILA.JULKAISTU ? flow(...validateFns)(eb) : eb;
  };

export const validateIf =
  (condition, ...validateFns) =>
  eb =>
    condition ? flow(...validateFns)(eb) : eb;

export const validateValintakokeet = errorBuilder => {
  const values = errorBuilder.getValues();
  const kieliversiot = getKielivalinta(values);
  return flow(
    validateTranslations('valintakokeet.yleisKuvaus', kieliversiot, {
      optional: true,
    }),
    validateArray(
      'valintakokeet.kokeetTaiLisanaytot',
      (eb, { liittyyEnnakkovalmistautumista, erityisjarjestelytMahdollisia }) =>
        flow(
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
            flow(
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
  get(values, 'kieliversiot') || get(values, 'perustiedot.kieliversiot') || [];

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
    flow(
      ...(kieliversiot ?? []).map(kieli =>
        flow(
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
