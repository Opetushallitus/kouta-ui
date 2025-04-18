import _ from 'lodash';

import { parseEditorState } from '#/src/components/LexicalEditorUI/utils';
import { toKielistettyWithValueField } from '#/src/utils';

export const getFormValuesByOppilaitos = oppilaitos => {
  const {
    kielivalinta,
    tila,
    esikatselu = false,
    logo,
    teemakuva,
    metadata = {},
  } = oppilaitos;

  const {
    tietoaOpiskelusta,
    hakijapalveluidenYhteystiedot: hy,
    esittely,
    opiskelijoita,
    korkeakouluja,
    tiedekuntia,
    kampuksia,
    yksikoita,
    toimipisteita,
    akatemioita,
    wwwSivu,
    some,
    jarjestaaUrheilijanAmmKoulutusta,
    esittelyvideo,
  } = metadata;

  return {
    kieliversiot: kielivalinta || [],
    tila,
    esikatselu,
    esittely: _.mapValues(esittely || {}, parseEditorState),
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
    tietoa: {
      osiot: (tietoaOpiskelusta || []).map(({ otsikkoKoodiUri }) => ({
        value: otsikkoKoodiUri,
      })),
      tiedot: (tietoaOpiskelusta || []).reduce(
        (acc, { otsikkoKoodiUri, teksti }) => {
          acc[otsikkoKoodiUri] = _.mapValues(teksti || {}, parseEditorState);

          return acc;
        },
        {}
      ),
    },
    perustiedot: {
      opiskelijoita: _.isNumber(opiskelijoita) ? opiskelijoita : '',
      korkeakouluja: _.isNumber(korkeakouluja) ? korkeakouluja : '',
      tiedekuntia: _.isNumber(tiedekuntia) ? tiedekuntia : '',
      kampuksia: _.isNumber(kampuksia) ? kampuksia : '',
      yksikoita: _.isNumber(yksikoita) ? yksikoita : '',
      toimipisteita: _.isNumber(toimipisteita) ? toimipisteita : '',
      akatemioita: _.isNumber(akatemioita) ? akatemioita : '',
      logo,
      wwwSivuUrl: wwwSivu?.url || {},
      wwwSivuNimi: wwwSivu?.nimi || {},
      some: some || {},
      jarjestaaUrheilijanAmmKoulutusta,
    },
    teemakuvaOrEsittelyvideo: {
      mediaType:
        _.isString(teemakuva) || _.isEmpty(esittelyvideo?.url)
          ? 'teemakuva'
          : 'esittelyvideo',
      teemakuvaUrl: teemakuva,
      esittelyvideoUrl: esittelyvideo?.url || {},
    },
  };
};
