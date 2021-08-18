import _ from 'lodash';
import _fp from 'lodash/fp';

import { serializeEditorState } from '#/src/components/Editor/utils';
import { isNumeric } from '#/src/utils';

export const getOppilaitoksenOsaByFormValues = ({
  tila,
  muokkaaja,
  ...values
}) => {
  const {
    oppilaitosOid,
    perustiedot,
    esittely,
    yhteystiedot = [],
    kieliversiot,
    teemakuva,
    esikatselu = false,
  } = values;

  const pickTranslations = _fp.pick(kieliversiot || []);

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
        }) => ({
          nimi: pickTranslations(nimi || {}),
          postiosoite:
            !_.isEmpty(postiosoite) || postinumero
              ? {
                  osoite: pickTranslations(postiosoite || {}),
                  postinumeroKoodiUri: postinumero?.value || null,
                }
              : null,
          kayntiosoite:
            !_.isEmpty(kayntiosoite) || kayntiosoitePostinumero
              ? {
                  osoite: pickTranslations(kayntiosoite || {}),
                  postinumeroKoodiUri: kayntiosoitePostinumero?.value || null,
                }
              : null,
          sahkoposti: pickTranslations(sahkoposti || {}),
          puhelinnumero: pickTranslations(puhelinnumero || {}),
        })
      ),
      esittely: _.mapValues(
        pickTranslations(esittely || {}),
        serializeEditorState
      ),
      opiskelijoita: isNumeric(perustiedot?.opiskelijoita)
        ? parseInt(perustiedot.opiskelijoita)
        : null,
      kampus: pickTranslations(perustiedot?.kampus || {}),
      wwwSivu: !_.isEmpty(perustiedot?.wwwSivuUrl)
        ? {
            url: pickTranslations(perustiedot.wwwSivuUrl || {}),
            nimi: pickTranslations(perustiedot.wwwSivuNimi || {}),
          }
        : null,
      jarjestaaUrheilijanAmmKoulutusta:
        perustiedot?.jarjestaaUrheilijanAmmKoulutusta,
    },
  };
};
