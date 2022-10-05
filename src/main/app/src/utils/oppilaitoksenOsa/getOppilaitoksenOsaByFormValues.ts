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
    kieliversiot,
    teemakuva,
    esikatselu = false,
    hakijapalveluidenYhteystiedot: hy,
  } = values;
  const pickTranslations = _fp.pick(kieliversiot || []);
  const hpy = Object.values(pickTranslations(hy?.nimi)).some(
    n => String(n).trim().length > 0
  );

  return {
    oppilaitosOid,
    tila,
    muokkaaja,
    kielivalinta: kieliversiot,
    teemakuva,
    esikatselu,
    metadata: {
      esittely: _.mapValues(
        pickTranslations(esittely || {}),
        serializeEditorState
      ),
      opiskelijoita: isNumeric(perustiedot?.opiskelijoita)
        ? parseInt(perustiedot.opiskelijoita)
        : null,
      kampus: pickTranslations(perustiedot?.kampus || {}),
      wwwSivu: _.isEmpty(perustiedot?.wwwSivuUrl)
        ? null
        : {
            url: pickTranslations(perustiedot.wwwSivuUrl || {}),
            nimi: pickTranslations(perustiedot.wwwSivuNimi || {}),
          },
      jarjestaaUrheilijanAmmKoulutusta:
        perustiedot?.jarjestaaUrheilijanAmmKoulutusta,
      hakijapalveluidenYhteystiedot: hpy
        ? {
            nimi: pickTranslations(hy.nimi || {}),
            postiosoite:
              !_.isEmpty(hy.postiosoite) || hy.postinumero
                ? {
                    osoite: pickTranslations(hy.postiosoite || {}),
                    postinumeroKoodiUri: hy.postinumero?.value || null,
                  }
                : null,
            kayntiosoite:
              !_.isEmpty(hy.kayntiosoite) || hy.kayntiosoitePostinumero
                ? {
                    osoite: pickTranslations(hy.kayntiosoite || {}),
                    postinumeroKoodiUri:
                      hy.kayntiosoitePostinumero?.value || null,
                  }
                : null,
            sahkoposti: pickTranslations(hy.sahkoposti || {}),
            puhelinnumero: pickTranslations(hy.puhelinnumero || {}),
          }
        : null,
    },
  };
};
