import _ from 'lodash';

import { isNumeric } from '#/src/utils';

import {
  pickAndSerializeTranslations,
  getKieleistyksetForKieliversiot,
} from '../pickTranslations';

export const getOppilaitoksenOsaByFormValues = ({
  tila,
  muokkaaja,
  ...values
}) => {
  const {
    perustiedot,
    esittely,
    kieliversiot,
    teemakuva,
    esikatselu = false,
    hakijapalveluidenYhteystiedot: hy,
  } = values;
  const kieleistykset = getKieleistyksetForKieliversiot(kieliversiot);
  const hpy = Object.values(kieleistykset(hy?.nimi)).some(
    n => String(n).trim().length > 0
  );
  return {
    tila,
    muokkaaja,
    kielivalinta: kieliversiot,
    teemakuva,
    esikatselu,
    metadata: {
      esittely: pickAndSerializeTranslations(esittely, kieliversiot),
      opiskelijoita: isNumeric(perustiedot?.opiskelijoita)
        ? parseInt(perustiedot.opiskelijoita)
        : null,
      kampus: kieleistykset(perustiedot?.kampus),
      wwwSivu: _.isEmpty(perustiedot?.wwwSivuUrl)
        ? null
        : {
            url: kieleistykset(perustiedot.wwwSivuUrl),
            nimi: kieleistykset(perustiedot.wwwSivuNimi),
          },
      jarjestaaUrheilijanAmmKoulutusta:
        perustiedot?.jarjestaaUrheilijanAmmKoulutusta,
      hakijapalveluidenYhteystiedot: hpy
        ? {
            nimi: kieleistykset(hy.nimi),
            postiosoite:
              !_.isEmpty(hy.postiosoite) || hy.postinumero
                ? {
                    osoite: kieleistykset(hy.postiosoite),
                    postinumeroKoodiUri: hy.postinumero?.value || null,
                  }
                : null,
            kayntiosoite:
              !_.isEmpty(hy.kayntiosoite) || hy.kayntiosoitePostinumero
                ? {
                    osoite: kieleistykset(hy.kayntiosoite),
                    postinumeroKoodiUri:
                      hy.kayntiosoitePostinumero?.value || null,
                  }
                : null,
            sahkoposti: kieleistykset(hy.sahkoposti),
            puhelinnumero: kieleistykset(hy.puhelinnumero),
          }
        : null,
    },
  };
};
