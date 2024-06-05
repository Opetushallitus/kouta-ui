import _ from 'lodash';

import { isNumeric, toKielistettyWithValueStr } from '#/src/utils';

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
    teemakuvaOrEsittelyvideo,
    esikatselu = false,
    hakijapalveluidenYhteystiedot: hy,
  } = values;
  const kieleistykset = getKieleistyksetForKieliversiot(kieliversiot);
  const hpy = Object.values(kieleistykset(hy?.nimi)).some(
    n => String(n).trim().length > 0
  );
  const composeEsittelyvideoNimiObject = (
    videoUrls: object
  ): object | undefined => {
    const languages = Object.keys(videoUrls).filter(lang =>
      Boolean(videoUrls[lang])
    );
    return languages.length > 0
      ? languages.reduce((obj, lang) => {
          return {
            ...obj,
            [lang]: 'esittelyvideo',
          };
        }, {})
      : undefined;
  };
  return {
    tila,
    muokkaaja,
    kielivalinta: kieliversiot,
    teemakuva:
      teemakuvaOrEsittelyvideo?.mediaType === 'teemakuva' &&
      teemakuvaOrEsittelyvideo?.teemakuvaUrl
        ? teemakuvaOrEsittelyvideo?.teemakuvaUrl
        : undefined,
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
                    postinumeroKoodiUri: kieleistykset(
                      toKielistettyWithValueStr(hy.postinumero)
                    ),
                  }
                : null,
            kayntiosoite:
              !_.isEmpty(hy.kayntiosoite) || hy.kayntiosoitePostinumero
                ? {
                    osoite: kieleistykset(hy.kayntiosoite),
                    postinumeroKoodiUri: kieleistykset(
                      toKielistettyWithValueStr(hy.kayntiosoitePostinumero)
                    ),
                  }
                : null,
            sahkoposti: kieleistykset(hy.sahkoposti),
            puhelinnumero: kieleistykset(hy.puhelinnumero),
          }
        : null,
      esittelyvideo:
        teemakuvaOrEsittelyvideo?.mediaType === 'esittelyvideo' &&
        Object.values(teemakuvaOrEsittelyvideo?.esittelyvideoUrl || {}).filter(
          Boolean
        ).length > 0
          ? {
              url: kieleistykset(teemakuvaOrEsittelyvideo?.esittelyvideoUrl),
              nimi: composeEsittelyvideoNimiObject(
                teemakuvaOrEsittelyvideo?.esittelyvideoUrl || {}
              ),
            }
          : undefined,
    },
  };
};
