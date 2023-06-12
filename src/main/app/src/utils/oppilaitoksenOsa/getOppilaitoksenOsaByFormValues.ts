import _ from 'lodash';

import { isNumeric } from '#/src/utils';

import {
  pickTranslations,
  pickTranslationsForEditorField,
} from '../pickTranslations';

export const getOppilaitoksenOsaByFormValues = ({
  tila,
  muokkaaja,
  ...values
}) => {
  const {
    oppilaitosOid,
    perustiedot,
    esittely,
    kieliversiot,
    teemakuva,
    esikatselu = false,
    hakijapalveluidenYhteystiedot: hy,
  } = values;
  const hpy = Object.values(pickTranslations(hy?.nimi, kieliversiot)).some(
    n => String(n).trim().length > 0
  );

  return {
    oppilaitosOid,
    tila,
    muokkaaja,
    kielivalinta: kieliversiot,
    teemakuva,
    esikatselu,
    metadata: {
      esittely: pickTranslationsForEditorField(esittely, kieliversiot),
      opiskelijoita: isNumeric(perustiedot?.opiskelijoita)
        ? parseInt(perustiedot.opiskelijoita)
        : null,
      kampus: pickTranslations(perustiedot?.kampus, kieliversiot),
      wwwSivu: _.isEmpty(perustiedot?.wwwSivuUrl)
        ? null
        : {
            url: pickTranslations(perustiedot.wwwSivuUrl, kieliversiot),
            nimi: pickTranslations(perustiedot.wwwSivuNimi, kieliversiot),
          },
      jarjestaaUrheilijanAmmKoulutusta:
        perustiedot?.jarjestaaUrheilijanAmmKoulutusta,
      hakijapalveluidenYhteystiedot: hpy
        ? {
            nimi: pickTranslations(hy.nimi, kieliversiot),
            postiosoite:
              !_.isEmpty(hy.postiosoite) || hy.postinumero
                ? {
                    osoite: pickTranslations(hy.postiosoite, kieliversiot),
                    postinumeroKoodiUri: hy.postinumero?.value || null,
                  }
                : null,
            kayntiosoite:
              !_.isEmpty(hy.kayntiosoite) || hy.kayntiosoitePostinumero
                ? {
                    osoite: pickTranslations(hy.kayntiosoite, kieliversiot),
                    postinumeroKoodiUri:
                      hy.kayntiosoitePostinumero?.value || null,
                  }
                : null,
            sahkoposti: pickTranslations(hy.sahkoposti, kieliversiot),
            puhelinnumero: pickTranslations(hy.puhelinnumero, kieliversiot),
          }
        : null,
    },
  };
};
