import get from 'lodash/get';

import {
  KOULUTUSTYYPPI,
  KOULUTUSTYYPIT,
  JULKAISUTILA,
  POHJAVALINTA,
  TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
} from '../constants';

import createFormConfigBuilder from './createFormConfigBuilder';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

const getMinTarjoajat = values => {
  return get(values, 'minTarjoajat', 1);
};

const validateIfJulkaistu = validate => (eb, values, ...rest) => {
  const { tila } = values;
  return tila === JULKAISUTILA.JULKAISTU ? validate(eb, values, ...rest) : eb;
};

const config = createFormConfigBuilder()
  .registerField('koulutustyyppi', 'koulutustyyppi', KOULUTUSTYYPIT, eb =>
    eb.validateExistence('koulutustyyppi'),
  )
  .registerField('pohja', 'pohja', KOULUTUSTYYPIT, (eb, values) =>
    get(values, 'pohja.tapa') === POHJAVALINTA.KOPIO
      ? eb.validateExistence('pohja.valinta')
      : eb,
  )
  .registerField('kieliversiot', 'kieliversiot', KOULUTUSTYYPIT, eb =>
    eb.validateArrayMinLength('kieliversiot', 1),
  )
  .registerField(
    'tiedot',
    'koulutuskoodiTiedoilla',
    TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
    eb => eb.validateExistence('information.koulutus'),
  )
  .registerField(
    'tiedot',
    'koulutuskoodi',
    [
      ...TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
      KOULUTUSTYYPPI.VALMA,
      KOULUTUSTYYPPI.TELMA,
      KOULUTUSTYYPPI.LUVA,
      KOULUTUSTYYPPI.PERUSOPETUKSEN_LISAOPETUS,
    ],
    eb => eb.validateExistence('information.koulutus'),
  )
  .registerField(
    'tiedot',
    'osaamisala',
    [KOULUTUSTYYPPI.LUKIOKOULUTUS, KOULUTUSTYYPPI.OSAAMISALA],
    eb => eb.validateExistence('information.koulutus'),
  )
  .registerField(
    'tiedot',
    'opintojenlaajuus',
    TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
  )
  .registerField(
    'tiedot',
    'tutkintonimike',
    TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
  )
  .registerField(
    'tiedot',
    'koulutusalat',
    TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
  )
  .registerField(
    'tiedot',
    'nimi',
    [
      ...TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
      KOULUTUSTYYPPI.AVOIN_YO,
      KOULUTUSTYYPPI.AVOIN_AMK,
      KOULUTUSTYYPPI.TAYDENNYS_KOULUTUS,
      KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS,
      KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJAKOULUTUS,
      KOULUTUSTYYPPI.AMMATILLINEN_ERITYISOPETTAJA_KOULUTUS,
      KOULUTUSTYYPPI.AMMATILLINEN_OPINTO_OHJAAJA_KOULUTUS,
    ],
    (eb, values) =>
      eb.validateTranslations('information.nimi', getKielivalinta(values)),
  )
  .registerField(
    'kuvaus',
    'nimi',
    TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
    validateIfJulkaistu((eb, values) =>
      eb.validateTranslations('description.nimi', getKielivalinta(values)),
    ),
  )
  .registerField(
    'kuvaus',
    'kuvaus',
    TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
  )
  .registerField('kuvaus', 'tekstiKuvaus', [
    ...TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
    KOULUTUSTYYPPI.LUKIOKOULUTUS,
    KOULUTUSTYYPPI.OSAAMISALA,
  ])
  .registerField('lisatiedot', 'osiot', KOULUTUSTYYPIT)
  .registerField('teemakuva', 'teemakuva', KOULUTUSTYYPIT)
  .registerField(
    'jarjestyspaikka',
    'jarjestyspaikka',
    KOULUTUSTYYPIT,
    validateIfJulkaistu((eb, values) =>
      eb.validateArrayMinLength('tarjoajat', getMinTarjoajat(values)),
    ),
  )
  .registerField('julkisuus', 'julkisuus', KOULUTUSTYYPIT)
  .registerField('julkaisutila', 'julkaisutila', KOULUTUSTYYPIT, eb =>
    eb.validateExistence('tila'),
  );

const getKoulutusFormConfig = koulutustyyppi => {
  return config.getKoulutustyyppiConfig(koulutustyyppi);
};

export default getKoulutusFormConfig;
