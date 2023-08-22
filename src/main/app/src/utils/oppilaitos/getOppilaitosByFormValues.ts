import _ from 'lodash';

import { isNumeric } from '#/src/utils';

import {
  getKieleistyksetForKieliversiot,
  getSerializedKieleistyksetFromKieliversiot,
} from '../pickTranslations';

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

  const kieleistykset = getKieleistyksetForKieliversiot(kieliversiot);
  const kieleistyksetSerialized =
    getSerializedKieleistyksetFromKieliversiot(kieliversiot);
  const tietoaOpiskelusta = (tietoa?.osiot || []).map(
    ({ value: otsikkoKoodiUri }) => ({
      otsikkoKoodiUri,
      teksti: kieleistyksetSerialized(
        _.get(tietoa, ['tiedot', otsikkoKoodiUri]) || {}
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
            nimi: kieleistykset(hy.nimi),
            postiosoite:
              !_.isEmpty(hy.postiosoite) || hy.postinumero
                ? {
                    osoite: kieleistykset(hy.postiosoite),
                    postinumeroKoodiUri: hy.postinumero?.value || null,
                  }
                : null,
            kayntiosoite:
              !_.isEmpty(hy.kayntiosoite) || hy.kayntiosoitePostinumero
                ? {
                    osoite: kieleistykset(hy.kayntiosoite),
                    postinumeroKoodiUri:
                      hy.kayntiosoitePostinumero?.value || null,
                  }
                : null,
            sahkoposti: kieleistykset(hy.sahkoposti),
            puhelinnumero: kieleistykset(hy.puhelinnumero),
          }
        : null,
      esittely: kieleistyksetSerialized(esittely),
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
      some: perustiedot.some,
      wwwSivu: _.isEmpty(perustiedot?.wwwSivuUrl)
        ? null
        : {
            url: kieleistykset(perustiedot.wwwSivuUrl),
            nimi: kieleistykset(perustiedot.wwwSivuNimi),
          },
    },
  };
};
