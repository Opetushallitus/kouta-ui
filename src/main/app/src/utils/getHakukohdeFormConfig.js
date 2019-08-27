import get from 'lodash/get';
import pick from 'lodash/pick';

import { JULKAISUTILA, LIITTEEN_TOIMITUSTAPA } from '../constants';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

const validateIfJulkaistu = validate => (eb, values, ...rest) => {
  const { tila } = values;

  return tila === JULKAISUTILA.JULKAISTU ? validate(eb, values, ...rest) : eb;
};

const getLiitteillaYhteinenToimitusaika = values =>
  !!get(values, 'liitteet.yhteinenToimitusaika');

const getLiitteillaYhteinenToimitusosoite = values =>
  !!get(values, 'liitteet.yhteinenToimituspaikka');

const getKaytetaanHaunAikataulua = values =>
  !get(values, 'hakuajat.eriHakuaika');

const validateLiitteet = (errorBuilder, values) => {
  const kieliversiot = getKielivalinta(values);

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

const validateValintakokeet = (errorBuilder, values) => {
  const valintakokeet = pick(
    get(values, 'valintakoe.tilaisuudet'),
    get(values, 'valintakoe.tyypit'),
  );

  const kieliversiot = getKielivalinta(values);

  return Object.keys(valintakokeet).reduce((acc, tyyppi) => {
    return acc.validateArray(`valintakoe.tilaisuudet.${tyyppi}`, eb => {
      return eb
        .validateTranslations('osoite', kieliversiot)
        .validateExistence('postinumero')
        .validateTranslations('postitoimipaikka', kieliversiot)
        .validateExistence('alkaa')
        .validateExistence('paattyy');
    });
  }, errorBuilder);
};

const baseConfig = {
  sections: {
    pohja: {
      fields: {
        pohja: true,
      },
    },
    kieliversiot: {
      fields: {
        kieliversiot: {
          validate: eb => eb.validateArrayMinLength('kieliversiot', 1),
        },
      },
    },
    pohjakoulutusvaatimus: {
      fields: {
        pohjakoulutusvaatimus: {
          validate: validateIfJulkaistu(eb =>
            eb.validateArrayMinLength('pohjakoulutus', 1),
          ),
        },
      },
    },
    perustiedot: {
      fields: {
        nimi: {
          validate: (eb, values) =>
            eb.validateTranslations(
              'perustiedot.nimi',
              getKielivalinta(values),
            ),
        },
        hakuaika: {
          validate: validateIfJulkaistu((eb, values) => {
            return !getKaytetaanHaunAikataulua(values)
              ? eb.validateArray('hakuajat.hakuajat', eb => {
                  return eb.validateExistence('alkaa');
                })
              : eb;
          }),
        },
        alkamiskausi: true,
        hakulomake: true,
      },
    },
    aloituspaikat: {
      fields: {
        aloituspaikat: true,
        ensikertalaistenAloituspaikat: true,
      },
    },
    valintaperusteenKuvaus: {
      fields: {
        kuvaus: true,
      },
    },
    valintakoe: {
      fields: {
        valintakokeet: validateIfJulkaistu((eb, values) =>
          validateValintakokeet(eb, values),
        ),
      },
    },
    liitteet: {
      fields: {
        liitteet: {
          validate: validateIfJulkaistu((eb, values) =>
            validateLiitteet(eb, values),
          ),
        },
      },
    },
    julkaisutila: {
      fields: {
        julkaisutila: {
          validate: eb => eb.validateExistence('tila'),
        },
      },
    },
  },
};

const getHakukohdeFormConfig = () => {
  return { ...baseConfig };
};

export default getHakukohdeFormConfig;
