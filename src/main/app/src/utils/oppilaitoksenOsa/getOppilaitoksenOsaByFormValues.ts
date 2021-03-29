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
          postiosoite,
          postinumero,
          kayntiosoite,
          kayntiosoitePostinumero,
          sahkoposti,
          puhelinnumero,
          verkkosivu,
        }) => ({
          nimi: _.pick(nimi || {}, kieliversiot),
          postiosoite:
            !_.isEmpty(postiosoite) || postinumero
              ? {
                  osoite: _.pick(postiosoite || {}, kieliversiot),
                  postinumeroKoodiUri: postinumero?.value || null,
                }
              : null,
          kayntiosoite:
            !_.isEmpty(kayntiosoitePostinumero) || kayntiosoitePostinumero
              ? {
                  osoite: _.pick(kayntiosoite || {}, kieliversiot),
                  postinumeroKoodiUri: kayntiosoitePostinumero?.value || null,
                }
              : null,
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
