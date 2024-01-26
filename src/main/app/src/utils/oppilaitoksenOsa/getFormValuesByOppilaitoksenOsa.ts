import _ from 'lodash';

import { parseEditorState } from '#/src/components/LexicalEditorUI/utils';

export const getFormValuesByOppilaitoksenOsa = oppilaitoksenOsa => {
  const {
    kielivalinta,
    teemakuva,
    tila,
    metadata = {},
    esikatselu = false,
  } = oppilaitoksenOsa;

  const {
    esittely,
    opiskelijoita,
    kampus,
    wwwSivu,
    jarjestaaUrheilijanAmmKoulutusta,
    hakijapalveluidenYhteystiedot: hy,
    esittelyvideo,
  } = metadata;

  return {
    tila,
    kieliversiot: kielivalinta,
    esittely: _.mapValues(esittely || {}, parseEditorState),
    perustiedot: {
      opiskelijoita: _.isNumber(opiskelijoita) ? opiskelijoita : '',
      kampus: kampus || {},
      wwwSivuUrl: wwwSivu?.url || {},
      wwwSivuNimi: wwwSivu?.nimi || {},
      jarjestaaUrheilijanAmmKoulutusta,
    },
    hakijapalveluidenYhteystiedot: hy
      ? {
          nimi: hy.nimi || {},
          postiosoite: hy.postiosoite?.osoite || {},
          postinumero: hy.postiosoite?.postinumeroKoodiUri
            ? {
                value: hy.postiosoite.postinumeroKoodiUri,
              }
            : null,
          kayntiosoite: hy.kayntiosoite?.osoite || {},
          kayntiosoitePostinumero: hy.kayntiosoite?.postinumeroKoodiUri
            ? { value: hy.kayntiosoite.postinumeroKoodiUri }
            : null,
          puhelinnumero: hy.puhelinnumero || {},
          sahkoposti: hy.sahkoposti || {},
        }
      : null,
    teemakuvaOrEsittelyvideo: {
      mediaType:
        _.isString(teemakuva) || _.isEmpty(esittelyvideo?.url)
          ? 'teemakuva'
          : 'esittelyvideo',
      teemakuvaUrl: teemakuva,
      esittelyvideoUrl: esittelyvideo?.url || {},
    },
    esikatselu,
  };
};
