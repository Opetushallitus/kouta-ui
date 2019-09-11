import mapValues from 'lodash/mapValues';

import parseEditorState from './draft/parseEditorState';
import { isNumber } from './index';

const getFormValuesByOppilaitos = oppilaitos => {
  const {
    kielivalinta,
    tila,
    metadata: {
      osat,
      tietoaOpiskelusta,
      osoite: { osoite, postinumeroKoodiUri },
      esittely,
      wwwSivu,
      puhelinnumero,
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
    osat: osat || [],
    esittely: mapValues(esittely || {}, parseEditorState),
    yhteystiedot: {
      osoite: osoite || {},
      postinumero: postinumeroKoodiUri ? { value: postinumeroKoodiUri } : null,
      verkkosivu: wwwSivu || {},
      puhelinnumero: puhelinnumero || '',
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
    },
  };
};

export default getFormValuesByOppilaitos;
