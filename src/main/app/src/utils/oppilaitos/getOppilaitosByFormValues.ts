import _ from 'lodash';

import { serializeEditorState } from '#/src/components/Editor/utils';
import { isNumeric } from '#/src/utils';

const getOppilaitosByFormValues = ({ tila, muokkaaja, ...values }) => {
  const {
    perustiedot,
    esittely,
    yhteystiedot,
    tietoa,
    kieliversiot,
    teemakuva,
    esikatselu = false,
  } = values;

  const {
    osoite,
    postinumero,
    puhelinnumero,
    verkkosivu,
    sahkoposti,
  } = yhteystiedot;

  const tietoaOpiskelusta = (_.get(tietoa, 'osiot') || []).map(
    ({ value: otsikkoKoodiUri }) => ({
      otsikkoKoodiUri,
      teksti: _.mapValues(
        _.pick(_.get(tietoa, ['tiedot', otsikkoKoodiUri]) || {}, kieliversiot),
        serializeEditorState
      ),
    })
  );

  return {
    tila,
    muokkaaja,
    kielivalinta: kieliversiot,
    logo: _.get(perustiedot, 'logo'),
    teemakuva,
    esikatselu,
    metadata: {
      yhteystiedot: {
        osoite: {
          osoite: _.pick(osoite || {}, kieliversiot),
          postinumeroKoodiUri: _.get(postinumero, 'value') || null,
        },
        sahkoposti: _.pick(sahkoposti || {}, kieliversiot),
        puhelinnumero: _.pick(puhelinnumero || {}, kieliversiot),
        wwwSivu: _.pick(verkkosivu || {}, kieliversiot),
      },
      esittely: _.mapValues(
        _.pick(esittely || {}, kieliversiot),
        serializeEditorState
      ),
      tietoaOpiskelusta,
      opiskelijoita: isNumeric(_.get(perustiedot, 'opiskelijoita'))
        ? parseInt(perustiedot.opiskelijoita)
        : null,
      korkeakouluja: isNumeric(_.get(perustiedot, 'korkeakouluja'))
        ? parseInt(perustiedot.korkeakouluja)
        : null,
      tiedekuntia: isNumeric(_.get(perustiedot, 'tiedekuntia'))
        ? parseInt(perustiedot.tiedekuntia)
        : null,
      kampuksia: isNumeric(_.get(perustiedot, 'kampuksia'))
        ? parseInt(perustiedot.kampuksia)
        : null,
      yksikoita: isNumeric(_.get(perustiedot, 'yksikoita'))
        ? parseInt(perustiedot.yksikoita)
        : null,
      toimipisteita: isNumeric(_.get(perustiedot, 'toimipisteita'))
        ? parseInt(perustiedot.toimipisteita)
        : null,
      akatemioita: isNumeric(_.get(perustiedot, 'akatemioita'))
        ? parseInt(perustiedot.akatemioita)
        : null,
    },
  };
};

export default getOppilaitosByFormValues;
