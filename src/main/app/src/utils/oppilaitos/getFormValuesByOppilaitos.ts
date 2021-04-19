import _ from 'lodash';

import { parseEditorState } from '#/src/components/Editor/utils';

export const getFormValuesByOppilaitos = oppilaitos => {
  const {
    kielivalinta,
    tila,
    esikatselu = false,
    logo,
    teemakuva,
    metadata: {
      tietoaOpiskelusta,
      yhteystiedot = [],
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
    },
  } = oppilaitos;

  return {
    kieliversiot: kielivalinta || [],
    tila,
    esikatselu,
    esittely: _.mapValues(esittely || {}, parseEditorState),
    yhteystiedot: yhteystiedot.map(yhteystieto => ({
      nimi: yhteystieto.nimi || {},
      postiosoite: yhteystieto.postiosoite?.osoite || {},
      postinumero: yhteystieto.postiosoite?.postinumeroKoodiUri
        ? { value: yhteystieto.postiosoite.postinumeroKoodiUri }
        : null,
      kayntiosoite: yhteystieto.kayntiosoite?.osoite || {},
      kayntiosoitePostinumero: yhteystieto.kayntiosoite?.postinumeroKoodiUri
        ? { value: yhteystieto.kayntiosoite.postinumeroKoodiUri }
        : null,
      puhelinnumero: yhteystieto.puhelinnumero || {},
      sahkoposti: yhteystieto.sahkoposti || {},
    })),
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
    },
    teemakuva,
  };
};
