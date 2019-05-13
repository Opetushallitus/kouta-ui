import get from 'lodash/get';
import pick from 'lodash/pick';

import { isArray, isNumeric } from '../../utils';
import { JULKAISUTILA } from '../../constants';
import { ErrorBuilder } from '../../validation';
import { getHakulomakeFieldsData, getHakulomakeFieldsValues } from '../utils';

const getKieliversiot = values => get(values, 'kieliversiot.languages') || [];

const getLiitteillaYhteinenToimitusaika = values =>
  !!get(values, 'liitteet.yhteinenToimitusaika');

const getLiitteillaYhteinenToimitusosoite = values =>
  !!get(values, 'liitteet.yhteinenToimituspaikka');

const getKaytetaanHaunAikataulua = values =>
  !get(values, 'hakuajat.eriHakuaika');

const getAsNumberOrNull = value => {
  return isNumeric(value) ? parseInt(value) : null;
};

export const getHakukohdeByValues = values => {
  const alkamiskausiKoodiUri = get(values, 'alkamiskausi.kausi') || null;
  const alkamisvuosi = getAsNumberOrNull(
    get(values, 'alkamiskausi.vuosi.value'),
  );
  const kielivalinta = getKieliversiot(values);

  const aloituspaikat = getAsNumberOrNull(
    get(values, 'aloituspaikat.aloituspaikkamaara'),
  );

  const eriHakulomake = Boolean(get(values, 'hakulomake.eriHakulomake'));

  const {
    hakulomakeId,
    hakulomakeKuvaus,
    hakulomakeLinkki,
    hakulomaketyyppi,
  } = getHakulomakeFieldsData({ values, kielivalinta });

  const kaytetaanHaunAikataulua = getKaytetaanHaunAikataulua(values);

  const hakuajat = kaytetaanHaunAikataulua
    ? []
    : (get(values, 'hakuajat.hakuajat') || []).map(({ alkaa, paattyy }) => ({
        alkaa: alkaa || null,
        paattyy: paattyy || null,
      }));

  const liitteidenToimitusosoite = {
    osoite: {
      osoite: pick(
        get(values, 'liitteet.toimitusosoite') || null,
        kielivalinta,
      ),
      postinumero: get(values, 'liitteet.toimituspostinumero') || null,
      postitoimipaikka: pick(
        get(values, 'liitteet.toimituspostitoimipaikka') || null,
        kielivalinta,
      ),
    },
    sahkoposti: get(values, 'liitteet.toimitussahkoposti') || null,
  };

  const liitteidenToimitusaika = get(values, 'liitteet.toimitusaika') || null;

  const liitteetOnkoSamaToimitusosoite = getLiitteillaYhteinenToimitusosoite(
    values,
  );

  const liitteetOnkoSamaToimitusaika = getLiitteillaYhteinenToimitusaika(
    values,
  );

  const liitteet = (get(values, 'liitteet.liitteet') || []).map(
    ({
      tyyppi,
      nimi,
      kuvaus,
      toimitusaika,
      toimitusosoite,
      toimituspostinumero,
      toimituspostitoimipaikka,
      toimitussahkoposti,
    }) => ({
      tyyppi: get(tyyppi, 'value') || null,
      nimi: pick(nimi || null, kielivalinta),
      toimitusaika: !liitteetOnkoSamaToimitusaika ? toimitusaika || null : null,
      toimitusosoite: {
        osoite: {
          osoite: pick(toimitusosoite || null, kielivalinta),
          postinumero: toimituspostinumero || null,
          postitoimipaikka: pick(
            toimituspostitoimipaikka || null,
            kielivalinta,
          ),
        },
        sahkoposti: toimitussahkoposti || null,
      },
      kuvaus: pick(kuvaus || null, kielivalinta),
    }),
  );

  const nimi = pick(get(values, 'perustiedot.nimi') || null, kielivalinta);

  const toinenAsteOnkoKaksoistutkinto = !!get(
    values,
    'perustiedot.voiSuorittaaKaksoistutkinnon',
  );
  const valintakoeTyypit = get(values, 'valintakoe.types') || [];
  const valintakokeetByTyyppi = get(values, 'valintakoe.kokeet') || {};

  const valintakokeet = valintakoeTyypit
    .map(tyyppi => ({ tyyppi, ...(valintakokeetByTyyppi[tyyppi] || {}) }))
    .map(({ tyyppi, kokeet }) => ({
      tyyppi,
      tilaisuudet: isArray(kokeet)
        ? kokeet.map(
            ({
              osoite,
              postinumero,
              postitoimipaikka,
              alkaa,
              paattyy,
              lisatietoja,
            }) => ({
              osoite: {
                osoite: pick(osoite || null, kielivalinta),
                postinumero: postinumero || null,
                postitoimipaikka: pick(postitoimipaikka || null, kielivalinta),
              },
              aika: {
                alkaa: alkaa || null,
                paattyy: paattyy || null,
              },
              lisatietoja: pick(lisatietoja || null, kielivalinta),
            }),
          )
        : [],
    }));

  const pohjakoulutusvaatimusKoodiUrit = (
    get(values, 'pohjakoulutus.koulutusvaatimukset') || []
  ).map(({ value }) => value);

  const valintaperuste =
    get(values, 'valintaperusteenKuvaus.valintaperuste.value') || null;

  const ensikertalaisenAloituspaikat = getAsNumberOrNull(
    get(values, 'aloituspaikat.ensikertalaismaara'),
  );

  return {
    alkamiskausiKoodiUri,
    kaytetaanHaunAikataulua,
    kielivalinta,
    aloituspaikat,
    hakuajat,
    liitteetOnkoSamaToimitusaika,
    liitteetOnkoSamaToimitusosoite,
    liitteet,
    alkamisvuosi,
    liitteidenToimitusosoite,
    liitteidenToimitusaika,
    nimi,
    toinenAsteOnkoKaksoistutkinto,
    valintakokeet,
    pohjakoulutusvaatimusKoodiUrit,
    valintaperuste,
    ensikertalaisenAloituspaikat,
    eriHakulomake,
    hakulomaketyyppi,
    hakulomakeId,
    hakulomakeLinkki,
    hakulomakeKuvaus,
  };
};

export const getValuesByHakukohde = hakukohde => {
  const {
    alkamiskausiKoodiUri = '',
    kaytetaanHaunAikataulua,
    kielivalinta = [],
    aloituspaikat = '',
    hakuajat = [],
    liitteetOnkoSamaToimitusaika,
    liitteetOnkoSamaToimitusosoite,
    liitteet = [],
    alkamisvuosi,
    liitteidenToimitusosoite = {},
    liitteidenToimitusaika,
    nimi = {},
    toinenAsteOnkoKaksoistutkinto,
    valintakokeet = [],
    pohjakoulutusvaatimusKoodiUrit = [],
    valintaperuste = '',
    ensikertalaisenAloituspaikat = '',
    eriHakulomake,
    hakulomaketyyppi,
    hakulomakeId,
    hakulomakeKuvaus,
    hakulomakeLinkki,
  } = hakukohde;

  const valintakoeTyypit = (valintakokeet || []).map(({ tyyppi }) => tyyppi);

  const valintakokeetByTyyppi = (valintakokeet || []).reduce(
    (acc, { tyyppi, tilaisuudet = [] }) => {
      if (tyyppi) {
        acc[tyyppi] = {
          kokeet: (tilaisuudet || []).map(
            ({
              aika: { alkaa, paattyy } = {},
              osoite: {
                osoite = {},
                postinumero = '',
                postitoimipaikka = {},
              } = {},
              lisatietoja = {},
            }) => {
              return {
                osoite,
                postinumero,
                postitoimipaikka,
                lisatietoja,
                alkaa: alkaa || '',
                paattyy: paattyy || '',
              };
            },
          ),
        };
      }

      return acc;
    },
    {},
  );

  return {
    alkamiskausi: {
      kausi: alkamiskausiKoodiUri,
      vuosi: {
        value: isNumeric(alkamisvuosi) ? alkamisvuosi.toString() : '',
      },
    },
    kieliversiot: {
      languages: kielivalinta,
    },
    aloituspaikat: {
      aloituspaikkamaara: isNumeric(aloituspaikat)
        ? aloituspaikat.toString()
        : '',
      ensikertalaismaara: isNumeric(ensikertalaisenAloituspaikat)
        ? ensikertalaisenAloituspaikat.toString()
        : '',
    },
    hakuajat: {
      eriHakuaika: !kaytetaanHaunAikataulua,
      hakuajat: (hakuajat || []).map(({ alkaa, paattyy }) => {
        return {
          alkaa: alkaa || '',
          paattyy: paattyy || '',
        };
      }),
    },
    perustiedot: {
      nimi,
      voiSuorittaaKaksoistutkinnon: !!toinenAsteOnkoKaksoistutkinto,
    },
    pohjakoulutus: {
      koulutusvaatimukset: (pohjakoulutusvaatimusKoodiUrit || []).map(
        value => ({
          value,
        }),
      ),
    },
    valintaperusteenKuvaus: {
      valintaperuste: {
        value: valintaperuste,
      },
    },
    valintakoe: {
      types: valintakoeTyypit,
      kokeet: valintakokeetByTyyppi,
    },
    liitteet: {
      toimitusosoite: get(liitteidenToimitusosoite, 'osoite.osoite') || {},
      toimituspostinumero:
        get(liitteidenToimitusosoite, 'osoite.postinumero') || '',
      toimituspostitoimipaikka:
        get(liitteidenToimitusosoite, 'osoite.postitoimipaikka') || {},
      toimitussahkoposti: get(liitteidenToimitusosoite, 'sahkoposti') || '',
      yhteinenToimituspaikka: !!liitteetOnkoSamaToimitusosoite,
      yhteinenToimitusaika: !!liitteetOnkoSamaToimitusaika,
      toimitusaika: liitteidenToimitusaika || '',
      liitteet: (liitteet || []).map(
        ({
          tyyppi,
          nimi = {},
          toimitusaika,
          toimitusosoite: {
            sahkoposti,
            osoite: { osoite, postinumero, postitoimipaikka } = {},
          } = {},
          kuvaus = {},
        }) => {
          return {
            tyyppi,
            nimi,
            kuvaus,
            toimitusaika: toimitusaika || '',
            toimitussahkoposti: sahkoposti || '',
            toimitusosoite: osoite || {},
            toimituspostinumero: postinumero || '',
            toimituspostitoimipaikka: postitoimipaikka || {},
          };
        },
      ),
    },
    hakulomake: {
      ...getHakulomakeFieldsValues({
        hakulomaketyyppi,
        hakulomakeId,
        hakulomakeKuvaus,
        hakulomakeLinkki,
      }),
      eriHakulomake: Boolean(eriHakulomake),
    },
  };
};

const validateLiitteet = ({ errorBuilder, values }) => {
  const kieliversiot = getKieliversiot(values);

  const liitteillaYhteinenToimitusaika = getLiitteillaYhteinenToimitusaika(
    values,
  );

  const liitteillaYhteinenToimitusosoite = getLiitteillaYhteinenToimitusosoite(
    values,
  );

  let enhancedErrorBuilder = errorBuilder.validateArray(
    'liitteet.liitteet',
    liitteetEb => {
      let enhancedLiitteetEb = liitteetEb
        .validateExistence('tyyppi')
        .validateTranslations('nimi', kieliversiot)
        .validateTranslations('kuvaus', kieliversiot);

      if (!liitteillaYhteinenToimitusaika) {
        enhancedLiitteetEb = enhancedLiitteetEb.validateExistence(
          'toimitusaika',
        );
      }

      if (!liitteillaYhteinenToimitusosoite) {
        enhancedLiitteetEb = enhancedLiitteetEb
          .validateTranslations('toimitusosoite', kieliversiot)
          .validateTranslations('toimituspostitoimipaikka', kieliversiot)
          .validateExistence('toimituspostinumero')
          .validateExistence('toimitussahkoposti');
      }

      return enhancedLiitteetEb;
    },
  );

  if (liitteillaYhteinenToimitusaika) {
    enhancedErrorBuilder = enhancedErrorBuilder.validateExistence(
      'liitteet.toimitusaika',
    );
  }

  if (liitteillaYhteinenToimitusosoite) {
    enhancedErrorBuilder = enhancedErrorBuilder
      .validateTranslations('liitteet.toimitusosoite', kieliversiot)
      .validateTranslations('liitteet.toimituspostitoimipaikka', kieliversiot)
      .validateExistence('liitteet.toimituspostinumero')
      .validateExistence('liitteet.toimitussahkoposti');
  }

  return enhancedErrorBuilder;
};

const validateEssentials = ({ values, errorBuilder }) => {
  const kielivalinta = getKieliversiot(values);

  return errorBuilder
    .validateArrayMinLength('kieliversiot.languages', 1)
    .validateTranslations('perustiedot.nimi', kielivalinta);
};

const validateCommon = ({ errorBuilder, values }) => {
  const kieliversiot = getKieliversiot(values);

  let enhancedErrorBuilder = errorBuilder
    .validateArrayMinLength('pohjakoulutus.koulutusvaatimukset', 1)
    .validateExistence('aloituspaikat.aloituspaikkamaara');

  enhancedErrorBuilder = validateLiitteet({
    errorBuilder: enhancedErrorBuilder,
    values,
  });

  if (!getKaytetaanHaunAikataulua(values)) {
    enhancedErrorBuilder = enhancedErrorBuilder.validateArray(
      'hakuajat.hakuajat',
      eb => {
        return eb.validateExistence('alkaa');
      },
    );
  }

  const valintakokeet = pick(
    get(values, 'valintakoe.kokeet'),
    get(values, 'valintakoe.types'),
  );

  enhancedErrorBuilder = Object.keys(valintakokeet).reduce((acc, tyyppi) => {
    return acc.validateArray(`valintakoe.kokeet.${tyyppi}.kokeet`, eb => {
      return eb
        .validateTranslations('osoite', kieliversiot)
        .validateExistence('postinumero')
        .validateTranslations('postitoimipaikka', kieliversiot)
        .validateExistence('alkaa')
        .validateExistence('paattyy');
    });
  }, enhancedErrorBuilder);

  return enhancedErrorBuilder;
};

export const validate = ({ tila, values }) => {
  let errorBuilder = new ErrorBuilder({ values });

  errorBuilder = validateEssentials({ values, errorBuilder });

  if (tila === JULKAISUTILA.TALLENNETTU) {
    return errorBuilder.getErrors();
  }

  errorBuilder = validateCommon({ errorBuilder, values });

  return errorBuilder.getErrors();
};
