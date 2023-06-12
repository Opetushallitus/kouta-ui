import _ from 'lodash';

import { isNumeric } from '#/src/utils';

import * as pickTranslations from '../pickTranslations';

const parseNumeric = value => (isNumeric(value) ? parseInt(value) : null);

export const getOppilaitosByFormValues = ({ tila, muokkaaja, ...values }) => {
  const {
    perustiedot,
    esittely,
    hakijapalveluidenYhteystiedot: hy,
    tietoa,
    kieliversiot,
    teemakuva,
    esikatselu = false,
  } = values;

  const tietoaOpiskelusta = (tietoa?.osiot || []).map(
    ({ value: otsikkoKoodiUri }) => ({
      otsikkoKoodiUri,
      teksti: pickTranslations.pickTranslationsForEditorField(
        _.get(tietoa, ['tiedot', otsikkoKoodiUri]) || {},
        kieliversiot
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
      hakijapalveluidenYhteystiedot: hy
        ? {
            nimi: pickTranslations.pickTranslations(hy.nimi, kieliversiot),
            postiosoite:
              !_.isEmpty(hy.postiosoite) || hy.postinumero
                ? {
                    osoite: pickTranslations.pickTranslations(
                      hy.postiosoite,
                      kieliversiot
                    ),
                    postinumeroKoodiUri: hy.postinumero?.value || null,
                  }
                : null,
            kayntiosoite:
              !_.isEmpty(hy.kayntiosoite) || hy.kayntiosoitePostinumero
                ? {
                    osoite: pickTranslations.pickTranslations(
                      hy.kayntiosoite,
                      kieliversiot
                    ),
                    postinumeroKoodiUri:
                      hy.kayntiosoitePostinumero?.value || null,
                  }
                : null,
            sahkoposti: pickTranslations.pickTranslations(
              hy.sahkoposti,
              kieliversiot
            ),
            puhelinnumero: pickTranslations.pickTranslations(
              hy.puhelinnumero,
              kieliversiot
            ),
          }
        : null,
      esittely: pickTranslations.pickTranslationsForEditorField(
        esittely,
        kieliversiot
      ),
      jarjestaaUrheilijanAmmKoulutusta:
        perustiedot?.jarjestaaUrheilijanAmmKoulutusta,
      tietoaOpiskelusta,
      opiskelijoita: parseNumeric(perustiedot?.opiskelijoita),
      korkeakouluja: parseNumeric(perustiedot?.korkeakouluja),
      tiedekuntia: parseNumeric(perustiedot?.tiedekuntia),
      kampuksia: parseNumeric(perustiedot?.kampuksia),
      yksikoita: parseNumeric(perustiedot?.yksikoita),
      toimipisteita: parseNumeric(perustiedot?.toimipisteita),
      akatemioita: parseNumeric(perustiedot?.akatemioita),
      wwwSivu: _.isEmpty(perustiedot?.wwwSivuUrl)
        ? null
        : {
            url: pickTranslations.pickTranslations(
              perustiedot.wwwSivuUrl,
              kieliversiot
            ),
            nimi: pickTranslations.pickTranslations(
              perustiedot.wwwSivuNimi,
              kieliversiot
            ),
          },
    },
  };
};
