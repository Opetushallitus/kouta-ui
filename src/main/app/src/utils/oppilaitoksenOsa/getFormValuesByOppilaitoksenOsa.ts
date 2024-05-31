import _ from 'lodash';

import { parseEditorState } from '#/src/components/LexicalEditorUI/utils';
import { toKielistettyWithValueField } from '#/src/utils';

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
          postinumero: toKielistettyWithValueField(
            hy.postiosoite?.postinumeroKoodiUri
          ),
          kayntiosoite: hy.kayntiosoite?.osoite || {},
          kayntiosoitePostinumero: toKielistettyWithValueField(
            hy.kayntiosoite?.postinumeroKoodiUri
          ),
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
