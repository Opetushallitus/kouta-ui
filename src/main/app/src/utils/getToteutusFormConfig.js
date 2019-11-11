import get from 'lodash/get';
import without from 'lodash/without';

import createFormConfigBuilder from './createFormConfigBuilder';

import {
  KOULUTUSTYYPPI,
  KOULUTUSTYYPIT,
  JULKAISUTILA,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT,
} from '../constants';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

const validateIfJulkaistu = validate => (eb, values, ...rest) => {
  const { tila } = values;

  return tila === JULKAISUTILA.JULKAISTU ? validate(eb, values, ...rest) : eb;
};

const config = createFormConfigBuilder()
  .registerField('pohja', 'pohja', KOULUTUSTYYPIT)
  .registerField('kieliversiot', 'kieliversiot', KOULUTUSTYYPIT, eb =>
    eb.validateArrayMinLength('kieliversiot', 1),
  )
  .registerField(
    'kuvaus',
    'kuvaus',
    without(
      KOULUTUSTYYPIT,
      KOULUTUSTYYPPI.LUKIOKOULUTUS,
    ),
  )
  .registerField(
    'osaamisalaTarkenteet',
    'osaamisalat',
    TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
  )
  .registerField(
    'osaamisalatYlempitutkinto',
    'osaamisalat',
    TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
    validateIfJulkaistu((eb, values) =>
      eb.validateArray('ylemmanKorkeakoulututkinnonOsaamisalat', eb => {
        return eb.validateTranslations('nimi', getKielivalinta(values));
      }),
    ),
  )
  .registerField(
    'osaamisalatAlempitutkinto',
    'osaamisalat',
    TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
    validateIfJulkaistu((eb, values) =>
      eb.validateArray('alemmanKorkeakoulututkinnonOsaamisalat', eb => {
        return eb.validateTranslations('nimi', getKielivalinta(values));
      }),
    ),
  )
  .registerField(
    'tiedot',
    'nimi',
    without(
      KOULUTUSTYYPIT,
      KOULUTUSTYYPPI.LUKIOKOULUTUS,
      KOULUTUSTYYPPI.VALMA,
      KOULUTUSTYYPPI.TELMA,
      KOULUTUSTYYPPI.LUVA,
      KOULUTUSTYYPPI.PERUSOPETUKSEN_LISAOPETUS,
    ),
    (eb, values) =>
      eb.validateTranslations('tiedot.nimi', getKielivalinta(values)),
  )
  .registerField(
    'tiedot',
    'toteutuksenKuvaus',
    without(
      KOULUTUSTYYPIT,
      KOULUTUSTYYPPI.LUKIOKOULUTUS,
    ),
  )
  .registerField(
    'tiedot',
    'ilmoittautumislinkki',
    TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT,
  )
  .registerField('tiedot', 'laajuus', TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT)
  .registerField(
    'tiedot',
    'aloituspaikat',
    without(
      TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT,
      KOULUTUSTYYPPI.VALMA,
      KOULUTUSTYYPPI.TELMA,
      KOULUTUSTYYPPI.LUVA,
      KOULUTUSTYYPPI.PERUSOPETUKSEN_LISAOPETUS,
    ),
  )
  .registerField('tiedot', 'kesto', [
    KOULUTUSTYYPPI.VALMA,
    KOULUTUSTYYPPI.TELMA,
    KOULUTUSTYYPPI.OSAAMISALA,
    KOULUTUSTYYPPI.LUVA,
    KOULUTUSTYYPPI.PERUSOPETUKSEN_LISAOPETUS,
  ])
  .registerField(
    'jarjestamistiedot',
    'opetuskieli',
    KOULUTUSTYYPIT,
    validateIfJulkaistu(eb =>
      eb.validateArrayMinLength('jarjestamistiedot.opetuskieli', 1),
    ),
  )
  .registerField(
    'jarjestamistiedot',
    'opetusaika',
    KOULUTUSTYYPIT,
    validateIfJulkaistu(eb =>
      eb.validateArrayMinLength('jarjestamistiedot.opetusaika', 1),
    ),
  )
  .registerField('jarjestamistiedot', 'opetustapa', KOULUTUSTYYPIT)
  .registerField(
    'jarjestamistiedot',
    'maksullisuus',
    KOULUTUSTYYPIT,
    validateIfJulkaistu(eb =>
      eb.validateExistence('jarjestamistiedot.maksullisuus.tyyppi'),
    ),
  )
  .registerField('jarjestamistiedot', 'stipendi', KOULUTUSTYYPIT)
  .registerField(
    'jarjestamistiedot',
    'koulutuksenAlkamispaivaamara',
    KOULUTUSTYYPIT,
    validateIfJulkaistu(eb =>
      eb.validateExistence('jarjestamistiedot.koulutuksenAlkamispaivamaara'),
    ),
  )
  .registerField(
    'jarjestamistiedot',
    'koulutuksenPaattymispaivamaara',
    KOULUTUSTYYPIT,
  )
  .registerField('jarjestamistiedot', 'osiot', KOULUTUSTYYPIT)
  .registerField('jarjestamistiedot', 'diplomi', [KOULUTUSTYYPPI.LUKIOKOULUTUS])
  .registerField('jarjestamistiedot', 'kielivalikoima', [
    KOULUTUSTYYPPI.LUKIOKOULUTUS,
  ])
  .registerField('nayttamistiedot', 'ammattinimikkeet', KOULUTUSTYYPIT)
  .registerField('nayttamistiedot', 'avainsanat', KOULUTUSTYYPIT)
  .registerField(
    'jarjestamispaikat',
    'jarjestamispaikat',
    KOULUTUSTYYPIT,
    validateIfJulkaistu(eb => eb.validateArrayMinLength('tarjoajat', 1)),
  )
  .registerField('yhteystiedot', 'yhteyshenkilot', KOULUTUSTYYPIT)
  .registerField(
    'lukiolinjat',
    'lukiolinja',
    [KOULUTUSTYYPPI.LUKIOKOULUTUS],
    eb => eb.validateExistence('lukiolinjat.lukiolinja'),
  )
  .registerField('julkaisutila', 'julkaisutila', KOULUTUSTYYPIT, eb =>
    eb.validateExistence('tila'),
  )
  .registerField('toteutusjaksot', 'toteutusjaksot', [
    KOULUTUSTYYPPI.AVOIN_YO,
    KOULUTUSTYYPPI.AVOIN_AMK,
    KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS,
    KOULUTUSTYYPPI.TAYDENNYS_KOULUTUS,
  ])
  .registerField('tutkinnonOsat', 'tutkinnonOsat', [
    KOULUTUSTYYPPI.TUTKINNON_OSA,
  ]);

const getToteutusFormConfig = koulutustyyppi => {
  return config.getKoulutustyyppiConfig(koulutustyyppi);
};

export default getToteutusFormConfig;
