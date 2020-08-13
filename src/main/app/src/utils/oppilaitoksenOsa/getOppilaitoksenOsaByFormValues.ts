import { mapValues, pick } from 'lodash';

import { serializeEditorState } from '#/src/components/Editor/utils';
import { isNumeric } from '#/src/utils';

const getOppilaitoksenOsaByFormValues = ({ tila, muokkaaja, ...values }) => {
  const {
    oppilaitosOid,
    perustiedot,
    esittely,
    yhteystiedot,
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

  return {
    oppilaitosOid,
    tila,
    muokkaaja,
    kielivalinta: kieliversiot,
    teemakuva: teemakuva,
    metadata: {
      yhteystiedot: {
        osoite: {
          osoite: pick(osoite || {}, kieliversiot),
          postinumeroKoodiUri: postinumero?.value ?? null,
        },
        sahkoposti: pick(sahkoposti || {}, kieliversiot),
        puhelinnumero: pick(puhelinnumero || {}, kieliversiot),
        wwwSivu: pick(verkkosivu || {}, kieliversiot),
      },
      esittely: mapValues(
        pick(esittely || {}, kieliversiot),
        serializeEditorState
      ),
      opiskelijoita: isNumeric(perustiedot?.opiskelijoita)
        ? parseInt(perustiedot.opiskelijoita)
        : null,
      kampus: pick(perustiedot?.kampus || {}, kieliversiot),
    },
  };
};

export default getOppilaitoksenOsaByFormValues;
