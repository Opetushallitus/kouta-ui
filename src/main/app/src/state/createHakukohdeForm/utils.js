import get from 'lodash/get';
import pick from 'lodash/pick';

import { isNumeric } from '../../utils';
import getValintakoeFieldsData from '../../utils/getValintakoeFieldsData';
import getValintakoeFieldsValues from '../../utils/getValintakoeFieldsValues';
import getHakulomakeFieldsData from '../../utils/getHakulomakeFieldsData';
import getHakulomakeFieldsValues from '../../utils/getHakulomakeFieldsValues';
import { JULKAISUTILA, LIITTEEN_TOIMITUSTAPA } from '../../constants';
import { ErrorBuilder } from '../../validation';

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
  } = getHakulomakeFieldsData({
    hakulomakeValues: get(values, 'hakulomake'),
    kielivalinta,
  });

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
        get(values, 'liitteet.toimitustapa.paikka.osoite') || null,
        kielivalinta,
      ),
      postinumero:
        get(values, 'liitteet.toimitustapa.paikka.postinumero') || null,
      postitoimipaikka: pick(
        get(values, 'liitteet.toimitustapa.paikka.postitoimipaikka') || null,
        kielivalinta,
      ),
    },
    sahkoposti: get(values, 'liitteet.toimitustapa.paikka.sahkoposti') || null,
  };

  const liitteidenToimitustapa = get(values, 'liitteet.toimitustapa.tapa');

  const liitteidenToimitusaika = get(values, 'liitteet.toimitusaika') || null;

  const liitteetOnkoSamaToimitusosoite = getLiitteillaYhteinenToimitusosoite(
    values,
  );

  const liitteetOnkoSamaToimitusaika = getLiitteillaYhteinenToimitusaika(
    values,
  );

  const liitteet = (get(values, 'liitteet.liitteet') || []).map(
    ({ tyyppi, nimi, kuvaus, toimitusaika, toimitustapa }) => ({
      toimitustapa: get(toimitustapa, 'tapa') || null,
      tyyppi: get(tyyppi, 'value') || null,
      nimi: pick(nimi || null, kielivalinta),
      toimitusaika: !liitteetOnkoSamaToimitusaika ? toimitusaika || null : null,
      toimitusosoite: {
        osoite: {
          osoite: pick(
            get(toimitustapa, 'paikka.osoite') || null,
            kielivalinta,
          ),
          postinumero: get(toimitustapa, 'paikka.postinumero') || null,
          postitoimipaikka: pick(
            get(toimitustapa, 'paikka.postitoimipaikka') || null,
            kielivalinta,
          ),
        },
        sahkoposti: get(toimitustapa, 'paikka.sahkoposti') || null,
      },
      kuvaus: pick(kuvaus || {}, kielivalinta),
    }),
  );

  const nimi = pick(get(values, 'perustiedot.nimi') || null, kielivalinta);

  const toinenAsteOnkoKaksoistutkinto = !!get(
    values,
    'perustiedot.voiSuorittaaKaksoistutkinnon',
  );

  const valintakokeet = getValintakoeFieldsData({
    valintakoeValues: get(values, 'valintakoe'),
    kielivalinta,
  });

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
    liitteidenToimitustapa: liitteetOnkoSamaToimitusosoite
      ? liitteidenToimitustapa
      : null,
    liitteet,
    alkamisvuosi,
    liitteidenToimitusosoite:
      liitteetOnkoSamaToimitusosoite &&
      liitteidenToimitustapa === LIITTEEN_TOIMITUSTAPA.MUU_OSOITE
        ? liitteidenToimitusosoite
        : null,
    liitteidenToimitusaika: liitteetOnkoSamaToimitusaika
      ? liitteidenToimitusaika
      : null,
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
    liitteidenToimitustapa,
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
    valintakoe: getValintakoeFieldsValues(valintakokeet),
    liitteet: {
      toimitustapa: {
        tapa: liitteidenToimitustapa || '',
        paikka: {
          sahkoposti: get(liitteidenToimitusosoite, 'sahkoposti') || '',
          osoite: get(liitteidenToimitusosoite, 'osoite.osoite') || {},
          postinumero:
            get(liitteidenToimitusosoite, 'osoite.postinumero') || '',
          postitoimipaikka:
            get(liitteidenToimitusosoite, 'osoite.postitoimipaikka') || {},
        },
      },
      yhteinenToimituspaikka: Boolean(liitteetOnkoSamaToimitusosoite),
      yhteinenToimitusaika: Boolean(liitteetOnkoSamaToimitusaika),
      toimitusaika: liitteidenToimitusaika || '',
      liitteet: (liitteet || []).map(
        ({
          tyyppi,
          nimi = {},
          toimitusaika,
          toimitustapa,
          toimitusosoite,
          kuvaus = {},
        }) => {
          return {
            tyyppi,
            nimi,
            kuvaus,
            toimitusaika: toimitusaika || '',
            toimitustapa: {
              tapa: toimitustapa || '',
              paikka: {
                osoite: get(toimitusosoite, 'osoite.osoite') || {},
                postinumero: get(toimitusosoite, 'osoite.postinumero') || '',
                postitoimipaikka:
                  get(toimitusosoite, 'osoite.postitoimipaikka') || {},
                sahkoposti: get(toimitusosoite, 'sahkoposti') || '',
              },
            },
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
    (liitteetEb, liite) => {
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
        enhancedLiitteetEb = enhancedLiitteetEb.validateExistence(
          'toimitustapa.tapa',
        );
      }

      if (
        !liitteillaYhteinenToimitusosoite &&
        get(liite, 'toimitustapa.tapa') === LIITTEEN_TOIMITUSTAPA.MUU_OSOITE
      ) {
        enhancedLiitteetEb = enhancedLiitteetEb
          .validateTranslations('toimitustapa.paikka.osoite', kieliversiot)
          .validateTranslations(
            'toimitustapa.paikka.postitoimipaikka',
            kieliversiot,
          )
          .validateExistence('toimitustapa.paikka.postinumero')
          .validateExistence('toimitustapa.paikka.sahkoposti');
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
    enhancedErrorBuilder = enhancedErrorBuilder.validateExistence(
      'liitteet.toimitustapa.tapa',
    );
  }

  if (
    liitteillaYhteinenToimitusosoite &&
    get(values, 'liitteet.toimitustapa.tapa') ===
      LIITTEEN_TOIMITUSTAPA.MUU_OSOITE
  ) {
    enhancedErrorBuilder = enhancedErrorBuilder
      .validateTranslations('liitteet.toimitustapa.paikka.osoite', kieliversiot)
      .validateTranslations(
        'liitteet.toimitustapa.paikka.postitoimipaikka',
        kieliversiot,
      )
      .validateExistence('liitteet.toimitustapa.paikka.postinumero')
      .validateExistence('liitteet.toimitustapa.paikka.sahkoposti');
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
    get(values, 'valintakoe.tilaisuudet'),
    get(values, 'valintakoe.tyypit'),
  );

  enhancedErrorBuilder = Object.keys(valintakokeet).reduce((acc, tyyppi) => {
    return acc.validateArray(`valintakoe.tilaisuudet.${tyyppi}`, eb => {
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
