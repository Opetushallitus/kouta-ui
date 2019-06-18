import get from 'lodash/get';
import pick from 'lodash/pick';

import { JULKAISUTILA, LIITTEEN_TOIMITUSTAPA } from '../constants';
import createErrorBuilder from './createErrorBuilder';

const getKieliversiot = values => get(values, 'kieliversiot') || [];

const getLiitteillaYhteinenToimitusaika = values =>
  !!get(values, 'liitteet.yhteinenToimitusaika');

const getLiitteillaYhteinenToimitusosoite = values =>
  !!get(values, 'liitteet.yhteinenToimituspaikka');

const getKaytetaanHaunAikataulua = values =>
  !get(values, 'hakuajat.eriHakuaika');

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
    .validateArrayMinLength('kieliversiot', 1)
    .validateTranslations('perustiedot.nimi', kielivalinta);
};

const validateCommon = ({ errorBuilder, values }) => {
  const kieliversiot = getKieliversiot(values);

  let enhancedErrorBuilder = errorBuilder.validateArrayMinLength(
    'pohjakoulutus',
    1,
  );

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

const validateHakukohdeForm = ({ tila, values }) => {
  let errorBuilder = createErrorBuilder(values);

  errorBuilder = validateEssentials({ values, errorBuilder });

  if (tila === JULKAISUTILA.TALLENNETTU) {
    return errorBuilder.getErrors();
  }

  errorBuilder = validateCommon({ errorBuilder, values });

  return errorBuilder.getErrors();
};

export default validateHakukohdeForm;
