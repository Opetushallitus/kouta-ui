import _ from 'lodash';

import { isNumeric, parseFloatComma } from '#/src/utils';

import {
  pickTranslations,
  pickTranslationsForEditorField,
} from '../pickTranslations';

export const getTilaisuusData =
  kielivalinta =>
  ({
    osoite,
    postinumero,
    alkaa,
    paattyy,
    lisatietoja,
    jarjestamispaikka,
  }) => ({
    osoite: {
      osoite: pickTranslations(osoite, kielivalinta),
      postinumeroKoodiUri: _.get(postinumero, 'value'),
    },
    aika: {
      alkaa: alkaa,
      paattyy: paattyy,
    },
    lisatietoja: pickTranslationsForEditorField(lisatietoja, kielivalinta),
    jarjestamispaikka: pickTranslations(jarjestamispaikka, kielivalinta),
  });

export const getKokeetTaiLisanaytotData = ({
  valintakoeValues = {},
  kielivalinta,
}) => {
  const kokeetTaiLisanaytot = _.get(valintakoeValues, 'kokeetTaiLisanaytot');
  if (_.isEmpty(kokeetTaiLisanaytot)) {
    return undefined;
  }

  return (kokeetTaiLisanaytot || []).map(
    ({
      id,
      tyyppi,
      nimi,
      tietoaHakijalle,
      vahimmaispistemaara,
      liittyyEnnakkovalmistautumista,
      ohjeetEnnakkovalmistautumiseen,
      erityisjarjestelytMahdollisia,
      ohjeetErityisjarjestelyihin,
      tilaisuudet = [],
    }) => ({
      id,
      tyyppiKoodiUri: _.get(tyyppi, 'value'),
      nimi: pickTranslations(nimi, kielivalinta),
      metadata: {
        tietoja: pickTranslationsForEditorField(tietoaHakijalle, kielivalinta),
        vahimmaispisteet: isNumeric(vahimmaispistemaara)
          ? parseFloatComma(vahimmaispistemaara)
          : null,
        liittyyEnnakkovalmistautumista,
        ohjeetEnnakkovalmistautumiseen: pickTranslationsForEditorField(
          ohjeetEnnakkovalmistautumiseen,
          kielivalinta
        ),
        erityisjarjestelytMahdollisia,
        ohjeetErityisjarjestelyihin: pickTranslationsForEditorField(
          ohjeetErityisjarjestelyihin,
          kielivalinta
        ),
      },
      tilaisuudet: tilaisuudet.map(getTilaisuusData(kielivalinta)),
    })
  );
};
