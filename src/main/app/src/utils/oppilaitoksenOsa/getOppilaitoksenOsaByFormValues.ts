import _ from 'lodash';

import { serializeEditorState } from '#/src/components/Editor/utils';
import { isNumeric } from '#/src/utils';

const getOppilaitoksenOsaByFormValues = ({ tila, muokkaaja, ...values }) => {
  const {
    oppilaitosOid,
    perustiedot,
    esittely,
    yhteystiedot = [],
    kieliversiot,
    teemakuva,
    esikatselu = false,
  } = values;

  return {
    oppilaitosOid,
    tila,
    muokkaaja,
    kielivalinta: kieliversiot,
    teemakuva,
    esikatselu,
    metadata: {
      yhteystiedot: yhteystiedot.map(
        ({
          nimi,
          osoite,
          postinumero,
          sahkoposti,
          puhelinnumero,
          verkkosivu,
        }) => ({
          nimi: _.pick(nimi || {}, kieliversiot),
          osoite: {
            osoite: _.pick(osoite || {}, kieliversiot),
            postinumeroKoodiUri: postinumero?.value || null,
          },
          sahkoposti: _.pick(sahkoposti || {}, kieliversiot),
          puhelinnumero: _.pick(puhelinnumero || {}, kieliversiot),
          wwwSivu: _.pick(verkkosivu || {}, kieliversiot),
        })
      ),
      esittely: _.mapValues(
        _.pick(esittely || {}, kieliversiot),
        serializeEditorState
      ),
      opiskelijoita: isNumeric(perustiedot?.opiskelijoita)
        ? parseInt(perustiedot.opiskelijoita)
        : null,
      kampus: _.pick(perustiedot?.kampus || {}, kieliversiot),
    },
  };
};

export default getOppilaitoksenOsaByFormValues;
