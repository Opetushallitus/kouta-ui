import get from 'lodash/get';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';

import serializeEditorState from './draft/serializeEditorState';
import { isNumeric } from './index';

const getOppilaitosByFormValues = ({ tila, muokkaaja, ...values }) => {
  const {
    perustiedot,
    esittely,
    yhteystiedot,
    tietoa,
    kieliversiot,
    teemakuva,
  } = values;

  const {
    osoite,
    postinumero,
    puhelinnumero,
    verkkosivu,
    sahkoposti,
  } = yhteystiedot;

  const tietoaOpiskelusta = (get(tietoa, 'osiot') || []).map(
    ({ value: otsikkoKoodiUri }) => ({
      otsikkoKoodiUri,
      teksti: pick(
        get(tietoa, ['tiedot', otsikkoKoodiUri]) || {},
        kieliversiot,
      ),
    }),
  );

  return {
    tila,
    muokkaaja,
    kielivalinta: kieliversiot,
    metadata: {
      yhteystiedot: {
        osoite: {
          osoite: pick(osoite || {}, kieliversiot),
          postinumeroKoodiUri: get(postinumero, 'value') || null,
        },
        sahkoposti: pick(sahkoposti || {}, kieliversiot),
        puhelinnumero: pick(puhelinnumero || {}, kieliversiot),
        wwwSivu: pick(verkkosivu || {}, kieliversiot),
      },
      esittely: mapValues(
        pick(esittely || {}, kieliversiot),
        serializeEditorState,
      ),
      tietoaOpiskelusta,
      opiskelijoita: isNumeric(get(perustiedot, 'opiskelijoita'))
        ? parseInt(perustiedot.opiskelijoita)
        : null,
      korkeakouluja: isNumeric(get(perustiedot, 'korkeakouluja'))
        ? parseInt(perustiedot.korkeakouluja)
        : null,
      tiedekuntia: isNumeric(get(perustiedot, 'tiedekuntia'))
        ? parseInt(perustiedot.tiedekuntia)
        : null,
      kampuksia: isNumeric(get(perustiedot, 'kampuksia'))
        ? parseInt(perustiedot.kampuksia)
        : null,
      yksikoita: isNumeric(get(perustiedot, 'yksikoita'))
        ? parseInt(perustiedot.yksikoita)
        : null,
      toimipisteita: isNumeric(get(perustiedot, 'toimipisteita'))
        ? parseInt(perustiedot.toimipisteita)
        : null,
      akatemioita: isNumeric(get(perustiedot, 'akatemioita'))
        ? parseInt(perustiedot.akatemioita)
        : null,
      teemakuva,
    },
  };
};

export default getOppilaitosByFormValues;
