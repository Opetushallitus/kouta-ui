import { get, mapValues, pick } from 'lodash';

import serializeEditorState from './draft/serializeEditorState';
import { isNumeric } from './index';

const getOppilaitoksenOsaByFormValues = ({ tila, muokkaaja, ...values }) => {
  const { perustiedot, esittely, yhteystiedot, kieliversiot } = values;

  const {
    osoite,
    postinumero,
    puhelinnumero,
    verkkosivu,
    sahkoposti,
  } = yhteystiedot;

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
        serializeEditorState
      ),
      opiskelijoita: isNumeric(get(perustiedot, 'opiskelijoita'))
        ? parseInt(perustiedot.opiskelijoita)
        : null,
      kampus: pick(get(perustiedot, 'kampus') || {}, kieliversiot),
    },
  };
};

export default getOppilaitoksenOsaByFormValues;
