import get from 'lodash/get';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';

import serializeEditorState from './draft/serializeEditorState';
import { isNumeric } from './index';

const getOppilaitoksenOsaByFormValues = ({ tila, muokkaaja, ...values }) => {
  const { perustiedot, esittely, yhteystiedot, kieliversiot } = values;

  const { osoite, postinumero, puhelinnumero, verkkosivu } = yhteystiedot;

  return {
    tila,
    muokkaaja,
    kielivalinta: kieliversiot,
    metadata: {
      osoite: {
        osoite: pick(osoite || {}, kieliversiot),
        postinumeroKoodiUri: get(postinumero, 'value') || null,
      },
      puhelinnumero: puhelinnumero || null,
      wwwSivu: pick(verkkosivu || {}, kieliversiot),
      esittely: mapValues(
        pick(esittely || {}, kieliversiot),
        serializeEditorState,
      ),
      opiskelijoita: isNumeric(get(perustiedot, 'opiskelijoita'))
        ? parseInt(perustiedot.opiskelijoita)
        : null,
      kampus: pick(get(perustiedot, 'kampus') || {}, kieliversiot),
    },
  };
};

export default getOppilaitoksenOsaByFormValues;
