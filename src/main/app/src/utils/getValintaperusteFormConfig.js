import { get, reduce } from 'lodash';

import { JULKAISUTILA, KOULUTUSTYYPIT, KOULUTUSTYYPPI } from '../constants';
import createFormConfigBuilder from './createFormConfigBuilder';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

const validateIfJulkaistu = validate => (eb, values, ...rest) => {
  const { tila } = values;

  return tila === JULKAISUTILA.JULKAISTU ? validate(eb, values, ...rest) : eb;
};

const koulutustyypitWithValintatapa = [
  KOULUTUSTYYPPI.YLIOPISTOKOULUTUS,
  KOULUTUSTYYPPI.AMKKOULUTUS,
  KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJAKOULUTUS,
  KOULUTUSTYYPPI.AMMATILLINEN_OPINTO_OHJAAJA_KOULUTUS,
  KOULUTUSTYYPPI.AMMATILLINEN_ERITYISOPETTAJA_KOULUTUS,
];

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

const config = createFormConfigBuilder()
  .registerField('pohja', 'pohja', KOULUTUSTYYPIT)
  .registerField('perustiedot', 'tyyppi', KOULUTUSTYYPIT, eb =>
    eb.validateExistence('perustiedot.tyyppi'),
  )
  .registerField('perustiedot', 'kieliversiot', KOULUTUSTYYPIT, eb =>
    eb.validateArrayMinLength('perustiedot.kieliversiot', 1),
  )
  .registerField(
    'perustiedot',
    'hakutapa',
    KOULUTUSTYYPIT,
    validateIfJulkaistu(eb => eb.validateExistence('perustiedot.hakutapa')),
  )
  .registerField('perustiedot', 'haunkohdejoukko', KOULUTUSTYYPIT)
  .registerField('kuvaus', 'nimi', KOULUTUSTYYPIT, (eb, values) =>
    eb.validateTranslations('kuvaus.nimi', getKielivalinta(values)),
  )
  .registerField('kuvaus', 'tarkenne', KOULUTUSTYYPIT)
  .registerField(
    'valintatapa',
    'valintatavat',
    koulutustyypitWithValintatapa,
    validateIfJulkaistu((eb, values) =>
      eb
        .validateArrayMinLength('valintatavat', 1, {
          isFieldArray: true,
        })
        .validateArray('valintatavat', eb =>
          eb
            .validateExistence('tapa')
            .validateTranslations('nimi', getKielivalinta(values)),
        ),
    ),
  )
  .registerField('soraKuvaus', 'soraKuvaus', KOULUTUSTYYPIT)
  .registerField('julkisuus', 'julkisuus', KOULUTUSTYYPIT)
  .registerField('julkaisutila', 'julkaisutila', KOULUTUSTYYPIT, eb =>
    eb.validateExistence('tila'),
  )
  .registerField(
    'valintakoe',
    'tyypit',
    KOULUTUSTYYPIT,
    validateIfJulkaistu((eb, values) => validateValintakokeet(eb, values)),
  );

const getValintaperusteFormConfig = koulutustyyppi => {
  return config.getKoulutustyyppiConfig(koulutustyyppi);
};

export default getValintaperusteFormConfig;
