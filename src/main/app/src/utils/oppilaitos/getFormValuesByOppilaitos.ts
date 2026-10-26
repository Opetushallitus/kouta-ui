import { isEmpty, isNumber, isString, mapValues } from 'lodash';

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
    esittely: mapValues(esittely || {}, parseEditorState),
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
          acc[otsikkoKoodiUri] = mapValues(teksti || {}, parseEditorState);

          return acc;
        },
        {}
      ),
    },
    perustiedot: {
      opiskelijoita: isNumber(opiskelijoita) ? opiskelijoita : '',
      korkeakouluja: isNumber(korkeakouluja) ? korkeakouluja : '',
      tiedekuntia: isNumber(tiedekuntia) ? tiedekuntia : '',
      kampuksia: isNumber(kampuksia) ? kampuksia : '',
      yksikoita: isNumber(yksikoita) ? yksikoita : '',
      toimipisteita: isNumber(toimipisteita) ? toimipisteita : '',
      akatemioita: isNumber(akatemioita) ? akatemioita : '',
      logo,
      wwwSivuUrl: wwwSivu?.url || {},
      wwwSivuNimi: wwwSivu?.nimi || {},
      some: some || {},
      jarjestaaUrheilijanAmmKoulutusta,
    },
    teemakuvaOrEsittelyvideo: {
      mediaType:
        isString(teemakuva) || isEmpty(esittelyvideo?.url)
          ? 'teemakuva'
          : 'esittelyvideo',
      teemakuvaUrl: teemakuva,
      esittelyvideoUrl: esittelyvideo?.url || {},
    },
  };
};
