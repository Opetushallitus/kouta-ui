import mapValues from 'lodash/mapValues';

import parseEditorState from './draft/parseEditorState';
import { isNumber } from './index';

const getFormValuesByOppilaitos = oppilaitos => {
  const {
    metadata: {
      osat,
      tietoaOpetuksesta,
      osoite,
      postinumero,
      postitoimipaikka,
      esittely,
      verkkosivu,
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
    osat: osat || [],
    esittely: mapValues(esittely || {}, parseEditorState),
    yhteystiedot: {
      osoite: osoite || {},
      postinumero: postinumero || '',
      postitoimipaikka: postitoimipaikka || {},
      verkkosivu: verkkosivu || '',
      puhelinnumero: puhelinnumero || '',
    },
    tietoa: {
      osiot: (tietoaOpetuksesta || []).map(({ otsikkoKoodiUri }) => ({
        value: otsikkoKoodiUri,
      })),
      tiedot: (tietoaOpetuksesta || []).reduce(
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
