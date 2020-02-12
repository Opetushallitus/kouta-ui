import { get, reduce } from 'lodash';

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
          .validateExistence('toimitustapa.paikka.postinumero.value')
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
      .validateExistence('liitteet.toimitustapa.paikka.postinumero.value')
      .validateExistence('liitteet.toimitustapa.paikka.sahkoposti');
  }

  return enhancedErrorBuilder;
};

const validateValintakokeet = (errorBuilder, values) => {
  const valintakoeTyypit = get(values, 'valintakoe.tyypit');
  const kieliversiot = getKielivalinta(values);

  return reduce(
    valintakoeTyypit,
    (ebAcc, { value: tyyppi }) =>
      ebAcc
        .validateArrayMinLength(`valintakoe.tilaisuudet.${tyyppi}`, 1, {
          isFieldArray: true,
        })
        .validateArray(`valintakoe.tilaisuudet.${tyyppi}`, eb =>
          eb
            .validateTranslations('osoite', kieliversiot)
            .validateExistence('postinumero')
            .validateExistence('alkaa')
            .validateExistence('paattyy'),
        ),
    errorBuilder,
  );
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
            eb.validateArrayMinLength('pohjakoulutus.pohjakoulutusvaatimus', 1),
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
          validate: validateIfJulkaistu((eb, values) =>
            get(values, 'hakuajat.eriHakuaika')
              ? eb
                  .validateArrayMinLength('hakuajat.hakuajat', 1, {
                    isFieldArray: true,
                  })
                  .validateArray('hakuajat.hakuajat', eb =>
                    eb.validateExistence('alkaa'),
                  )
              : eb,
          ),
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
        tyypit: {
          validate: validateIfJulkaistu((eb, values) =>
            validateValintakokeet(eb, values),
          ),
        },
        tilaisuudet: true,
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
