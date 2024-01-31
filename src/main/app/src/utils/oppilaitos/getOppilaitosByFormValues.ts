import _ from 'lodash';

import { SelectValue } from '#/src/types/formTypes';
import { isNumeric } from '#/src/utils';

import {
  getKieleistyksetForKieliversiot,
  getSerializedKieleistyksetFromKieliversiot,
} from '../pickTranslations';

const parseNumeric = value => (isNumeric(value) ? parseInt(value) : null);

export const getOppilaitosByFormValues = ({ tila, muokkaaja, ...values }) => {
  const {
    perustiedot,
    esittely,
    hakijapalveluidenYhteystiedot: hy,
    tietoa,
    kieliversiot,
    teemakuvaOrEsittelyvideo,
    esikatselu = false,
  } = values;

  const kieleistykset = getKieleistyksetForKieliversiot(kieliversiot);
  const kieleistyksetSerialized =
    getSerializedKieleistyksetFromKieliversiot(kieliversiot);
  const tietoaOpiskelusta = (tietoa?.osiot || []).map(
    ({ value: otsikkoKoodiUri }) => ({
      otsikkoKoodiUri,
      teksti: kieleistyksetSerialized(
        _.get(tietoa, ['tiedot', otsikkoKoodiUri]) || {}
      ),
    })
  );

  interface Some {
    [key: string]: string;
  }

  const removeEmptySomeKeys = (some: Some): Partial<Some> => {
    let someWithEmptyValsRemoved: Partial<Some> = some;
    Object.keys(some).forEach((key: string) => {
      if (some[key].trim().length < 1) {
        someWithEmptyValsRemoved = _.omit(someWithEmptyValsRemoved, [key]);
      }
    });
    return someWithEmptyValsRemoved;
  };

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

  const reduceToKielistettyWithValueStr = (
    obj: Record<LanguageCode, SelectValue>
  ) => {
    return Object.entries(obj || {}).reduce((result, [key, val]) => {
      return key && val?.value ? { ...result, [key]: val.value } : result;
    }, {});
  };

  return {
    tila,
    muokkaaja,
    kielivalinta: kieliversiot,
    logo: perustiedot?.logo,
    teemakuva:
      teemakuvaOrEsittelyvideo?.mediaType === 'teemakuva' &&
      teemakuvaOrEsittelyvideo?.teemakuvaUrl
        ? teemakuvaOrEsittelyvideo?.teemakuvaUrl
        : undefined,
    esikatselu,
    metadata: {
      hakijapalveluidenYhteystiedot: hy
        ? {
            nimi: kieleistykset(hy.nimi),
            postiosoite:
              !_.isEmpty(hy.postiosoite) || hy.postinumero
                ? {
                    osoite: kieleistykset(hy.postiosoite),
                    postinumeroKoodiUri: kieleistykset(
                      reduceToKielistettyWithValueStr(hy.postinumero)
                    ),
                  }
                : null,
            kayntiosoite:
              !_.isEmpty(hy.kayntiosoite) || hy.kayntiosoitePostinumero
                ? {
                    osoite: kieleistykset(hy.kayntiosoite),
                    postinumeroKoodiUri: kieleistykset(
                      reduceToKielistettyWithValueStr(
                        hy.kayntiosoitePostinumero
                      )
                    ),
                  }
                : null,
            sahkoposti: kieleistykset(hy.sahkoposti),
            puhelinnumero: kieleistykset(hy.puhelinnumero),
          }
        : null,
      esittely: kieleistyksetSerialized(esittely),
      jarjestaaUrheilijanAmmKoulutusta:
        perustiedot?.jarjestaaUrheilijanAmmKoulutusta,
      tietoaOpiskelusta,
      opiskelijoita: parseNumeric(perustiedot?.opiskelijoita),
      korkeakouluja: parseNumeric(perustiedot?.korkeakouluja),
      tiedekuntia: parseNumeric(perustiedot?.tiedekuntia),
      kampuksia: parseNumeric(perustiedot?.kampuksia),
      yksikoita: parseNumeric(perustiedot?.yksikoita),
      toimipisteita: parseNumeric(perustiedot?.toimipisteita),
      akatemioita: parseNumeric(perustiedot?.akatemioita),
      some: perustiedot?.some
        ? removeEmptySomeKeys(perustiedot.some)
        : undefined,
      wwwSivu: _.isEmpty(perustiedot?.wwwSivuUrl)
        ? null
        : {
            url: kieleistykset(perustiedot.wwwSivuUrl),
            nimi: kieleistykset(perustiedot.wwwSivuNimi),
          },
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
