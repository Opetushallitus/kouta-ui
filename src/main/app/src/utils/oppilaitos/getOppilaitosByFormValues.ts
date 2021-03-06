import _ from 'lodash';
import _fp from 'lodash/fp';

import { serializeEditorState } from '#/src/components/Editor/utils';
import { isNumeric } from '#/src/utils';

const parseNumeric = value => (isNumeric(value) ? parseInt(value) : null);

export const getOppilaitosByFormValues = ({ tila, muokkaaja, ...values }) => {
  const {
    perustiedot,
    esittely,
    yhteystiedot,
    hakijapalveluidenYhteystiedot: hy,
    tietoa,
    kieliversiot,
    teemakuva,
    esikatselu = false,
  } = values;

  const pickTranslations = _fp.pick(kieliversiot || []);

  const tietoaOpiskelusta = (tietoa?.osiot || []).map(
    ({ value: otsikkoKoodiUri }) => ({
      otsikkoKoodiUri,
      teksti: _.mapValues(
        pickTranslations(_.get(tietoa, ['tiedot', otsikkoKoodiUri]) || {}),
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
      yhteystiedot:
        yhteystiedot?.map(
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
        ) ?? [],
      hakijapalveluidenYhteystiedot: hy
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
      esittely: _.mapValues(
        pickTranslations(esittely || {}),
        serializeEditorState
      ),
      tietoaOpiskelusta,
      opiskelijoita: parseNumeric(perustiedot?.opiskelijoita),
      korkeakouluja: parseNumeric(perustiedot?.korkeakouluja),
      tiedekuntia: parseNumeric(perustiedot?.tiedekuntia),
      kampuksia: parseNumeric(perustiedot?.kampuksia),
      yksikoita: parseNumeric(perustiedot?.yksikoita),
      toimipisteita: parseNumeric(perustiedot?.toimipisteita),
      akatemioita: parseNumeric(perustiedot?.akatemioita),
      wwwSivu: !_.isEmpty(perustiedot?.wwwSivuUrl)
        ? {
            url: pickTranslations(perustiedot.wwwSivuUrl || {}),
            nimi: pickTranslations(perustiedot.wwwSivuNimi || {}),
          }
        : null,
    },
  };
};
