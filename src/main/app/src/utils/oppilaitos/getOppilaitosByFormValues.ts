import _ from 'lodash';

import { serializeEditorState } from '#/src/components/Editor/utils';
import { isNumeric } from '#/src/utils';

const getOppilaitosByFormValues = ({ tila, muokkaaja, ...values }) => {
  const {
    perustiedot,
    esittely,
    yhteystiedot,
    hakijapalveluidenYhteystiedot,
    tietoa,
    kieliversiot,
    teemakuva,
    esikatselu = false,
  } = values;

  const tietoaOpiskelusta = (tietoa?.osiot || []).map(
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
    logo: perustiedot?.logo,
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
      hakijapalveluidenYhteystiedot: hakijapalveluidenYhteystiedot
        ? {
            nimi: _.pick(
              hakijapalveluidenYhteystiedot.nimi || {},
              kieliversiot
            ),
            osoite: {
              osoite: _.pick(
                hakijapalveluidenYhteystiedot.osoite || {},
                kieliversiot
              ),
              postinumeroKoodiUri:
                _.get(hakijapalveluidenYhteystiedot.postinumero, 'value') ||
                null,
            },
            sahkoposti: _.pick(
              hakijapalveluidenYhteystiedot.sahkoposti || {},
              kieliversiot
            ),
            puhelinnumero: _.pick(
              hakijapalveluidenYhteystiedot.puhelinnumero || {},
              kieliversiot
            ),
            wwwSivu: _.pick(
              hakijapalveluidenYhteystiedot.verkkosivu || {},
              kieliversiot
            ),
          }
        : null,
      esittely: _.mapValues(
        _.pick(esittely || {}, kieliversiot),
        serializeEditorState
      ),
      tietoaOpiskelusta,
      opiskelijoita: isNumeric(perustiedot?.opiskelijoita)
        ? parseInt(perustiedot.opiskelijoita)
        : null,
      korkeakouluja: isNumeric(perustiedot?.korkeakouluja)
        ? parseInt(perustiedot.korkeakouluja)
        : null,
      tiedekuntia: isNumeric(perustiedot?.tiedekuntia)
        ? parseInt(perustiedot.tiedekuntia)
        : null,
      kampuksia: isNumeric(perustiedot?.kampuksia)
        ? parseInt(perustiedot.kampuksia)
        : null,
      yksikoita: isNumeric(perustiedot?.yksikoita)
        ? parseInt(perustiedot.yksikoita)
        : null,
      toimipisteita: isNumeric(perustiedot?.toimipisteita)
        ? parseInt(perustiedot.toimipisteita)
        : null,
      akatemioita: isNumeric(perustiedot?.akatemioita)
        ? parseInt(perustiedot.akatemioita)
        : null,
    },
  };
};

export default getOppilaitosByFormValues;
