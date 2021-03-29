import _ from 'lodash';

import { parseEditorState } from '#/src/components/Editor/utils';

const getFormValuesByOppilaitos = oppilaitos => {
  const {
    kielivalinta,
    tila,
    esikatselu = false,
    logo,
    teemakuva,
    metadata: {
      tietoaOpiskelusta,
      yhteystiedot = [],
      hakijapalveluidenYhteystiedot,
      esittely,
      opiskelijoita,
      korkeakouluja,
      tiedekuntia,
      kampuksia,
      yksikoita,
      toimipisteita,
      akatemioita,
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
      verkkosivu: yhteystieto.wwwSivu || {},
      puhelinnumero: yhteystieto.puhelinnumero || {},
      sahkoposti: yhteystieto.sahkoposti || {},
    })),
    hakijapalveluidenYhteystiedot: hakijapalveluidenYhteystiedot
      ? {
          nimi: hakijapalveluidenYhteystiedot.nimi || {},
          postiosoite: hakijapalveluidenYhteystiedot.postiosoite?.osoite || {},
          postinumero: hakijapalveluidenYhteystiedot.postiosoite
            ?.postinumeroKoodiUri
            ? {
                value:
                  hakijapalveluidenYhteystiedot.postiosoite.postinumeroKoodiUri,
              }
            : null,
          verkkosivu: hakijapalveluidenYhteystiedot.wwwSivu || {},
          puhelinnumero: hakijapalveluidenYhteystiedot.puhelinnumero || {},
          sahkoposti: hakijapalveluidenYhteystiedot.sahkoposti || {},
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
    },
    teemakuva,
  };
};

export default getFormValuesByOppilaitos;
