import { get, isNumber, mapValues } from 'lodash';
import parseEditorState from './draft/parseEditorState';

const getFormValuesByOppilaitos = oppilaitos => {
  const {
    kielivalinta,
    tila,
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
    esittely: mapValues(esittely || {}, parseEditorState),
    yhteystiedot: {
      osoite: get(yhteystiedot, 'osoite.osoite') || {},
      postinumero: get(yhteystiedot, 'osoite.postinumeroKoodiUri')
        ? { value: yhteystiedot.osoite.postinumeroKoodiUri }
        : null,
      verkkosivu: get(yhteystiedot, 'wwwSivu') || {},
      puhelinnumero: get(yhteystiedot, 'puhelinnumero') || {},
      sahkoposti: get(yhteystiedot, 'sahkoposti') || {},
    },
    tietoa: {
      osiot: (tietoaOpiskelusta || []).map(({ otsikkoKoodiUri }) => ({
        value: otsikkoKoodiUri,
      })),
      tiedot: (tietoaOpiskelusta || []).reduce(
        (acc, { otsikkoKoodiUri, teksti }) => {
          acc[otsikkoKoodiUri] = teksti || {};

          return acc;
        },
        {},
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
    },
    teemakuva,
  };
};

export default getFormValuesByOppilaitos;
