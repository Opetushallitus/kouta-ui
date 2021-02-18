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
      yhteystiedot,
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
    yhteystiedot: {
      osoite: _.get(yhteystiedot, 'osoite.osoite') || {},
      postinumero: _.get(yhteystiedot, 'osoite.postinumeroKoodiUri')
        ? { value: yhteystiedot.osoite.postinumeroKoodiUri }
        : null,
      verkkosivu: _.get(yhteystiedot, 'wwwSivu') || {},
      puhelinnumero: _.get(yhteystiedot, 'puhelinnumero') || {},
      sahkoposti: _.get(yhteystiedot, 'sahkoposti') || {},
    },
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
