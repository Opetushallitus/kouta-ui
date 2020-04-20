import { get, without } from 'lodash';

import createFormConfigBuilder from './createFormConfigBuilder';

import {
  KOULUTUSTYYPPI,
  KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT,
} from '../constants';

import {
  validateIfJulkaistu,
  getKielivalinta,
  kieliversiotSectionConfig,
  pohjaValintaSectionConfig,
  tilaSectionConfig,
} from '#/src/utils/formConfigUtils';

const config = createFormConfigBuilder().registerSections([
  pohjaValintaSectionConfig,
  kieliversiotSectionConfig,
  {
    section: 'tiedot',
    fragments: [],
    parts: [
      {
        fragment: 'nimi',
        field: '.nimi',
        koulutustyypit: without(
          KOULUTUSTYYPIT,
          KOULUTUSTYYPPI.LUKIOKOULUTUS,
          KOULUTUSTYYPPI.VALMA,
          KOULUTUSTYYPPI.TELMA,
          KOULUTUSTYYPPI.LUVA,
          KOULUTUSTYYPPI.PERUSOPETUKSEN_LISAOPETUS,
        ),
        required: true,
        validate: (eb, values) =>
          eb.validateTranslations('tiedot.nimi', getKielivalinta(values)),
      },
      {
        field: '.toteutuksenKuvaus',
        koulutustyypit: without(KOULUTUSTYYPIT, KOULUTUSTYYPPI.LUKIOKOULUTUS),
      },
      {
        field: '.ilmoittautumislinkki',
        koulutustyypit: TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT,
      },
      {
        field: '.laajuus',
        koulutustyypit: TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT,
      },
      {
        field: '.aloituspaikat',
        koulutustyypit: without(
          TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT,
          KOULUTUSTYYPPI.VALMA,
          KOULUTUSTYYPPI.TELMA,
          KOULUTUSTYYPPI.LUVA,
          KOULUTUSTYYPPI.PERUSOPETUKSEN_LISAOPETUS,
        ),
      },
      {
        field: '.kesto',
        koulutustyypit: [
          KOULUTUSTYYPPI.VALMA,
          KOULUTUSTYYPPI.TELMA,
          KOULUTUSTYYPPI.OSAAMISALA,
          KOULUTUSTYYPPI.LUVA,
          KOULUTUSTYYPPI.PERUSOPETUKSEN_LISAOPETUS,
        ],
      },
    ],
  },
  {
    section: 'lukiolinjat',
    field: '.lukiolinja',
    koulutustyypit: [KOULUTUSTYYPPI.LUKIOKOULUTUS],
    validate: eb => eb.validateExistence('lukiolinjat.lukiolinja'),
  },
  {
    section: 'tutkinnonOsat',
    field: 'tutkinnonOsat',
    koulutustyypit: [KOULUTUSTYYPPI.TUTKINNON_OSA],
  },
  {
    section: 'toteutusjaksot',
    field: 'toteutusjaksot',
    koulutustyypit: [
      KOULUTUSTYYPPI.AVOIN_YO,
      KOULUTUSTYYPPI.AVOIN_AMK,
      KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS,
      KOULUTUSTYYPPI.TAYDENNYS_KOULUTUS,
    ],
  },
  {
    section: 'alemmanKorkeakoulututkinnonOsaamisalat',
    koulutustyypit: TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
    parts: [
      {
        field: 'alemmanKorkeakoulututkinnonOsaamisalat',
        validate: validateIfJulkaistu((eb, values) =>
          eb.validateArray('alemmanKorkeakoulututkinnonOsaamisalat', eb =>
            eb.validateTranslations('nimi', getKielivalinta(values)),
          ),
        ),
      },
      {
        field: '.nimi',
        required: true,
      },
    ],
  },
  {
    section: 'ylemmanKorkeakoulututkinnonOsaamisalat',
    field: 'ylemmanKorkeakoulututkinnonOsaamisalat',
    koulutustyypit: TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
    validate: validateIfJulkaistu((eb, values) =>
      eb.validateArray('ylemmanKorkeakoulututkinnonOsaamisalat', eb =>
        eb.validateTranslations('nimi', getKielivalinta(values)),
      ),
    ),
    required: true,
  },
  {
    section: 'osaamisalat',
    field: 'osaamisalat',
    koulutustyypit: TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
  },
  {
    section: 'jarjestamistiedot',
    koulutustyypit: KOULUTUSTYYPIT,
    field: 'jarjestamistiedot',
    parts: [
      {
        field: '.opetuskieli',
        validate: validateIfJulkaistu(eb =>
          eb.validateArrayMinLength('jarjestamistiedot.opetuskieli', 1),
        ),
        required: true,
      },
      {
        field: '.opetusaika',
        validate: validateIfJulkaistu(eb =>
          eb.validateArrayMinLength('jarjestamistiedot.opetusaika', 1),
        ),
        required: true,
      },
      {
        field: '.opetusaikaKuvaus',
      },
      {
        field: '.opetustapa',
        validate: validateIfJulkaistu(eb =>
          eb.validateExistence('jarjestamistiedot.opetustapa'),
        ),
        required: true,
      },
      {
        field: '.opetustapa',
        validate: validateIfJulkaistu(eb =>
          eb.validateExistence('jarjestamistiedot.opetustapa'),
        ),
        required: true,
      },
      {
        field: '.maksullisuus.tyyppi',
        validate: validateIfJulkaistu(eb =>
          eb.validateExistence('jarjestamistiedot.maksullisuus.tyyppi'),
        ),
        required: true,
      },
      {
        field: '.maksullisuus.maksu',
        validate: validateIfJulkaistu((eb, values) =>
          get(values, 'jarjestamistiedot.maksullisuus.tyyppi') === 'kylla'
            ? eb.validateExistence('jarjestamistiedot.maksullisuus.maksu')
            : eb,
        ),
      },
      {
        fragment: 'stipendi',
      },
      {
        field: '.koulutuksenAlkamispaivaamara',
        validate: validateIfJulkaistu(eb =>
          eb.getValue('jarjestamistiedot.koulutuksenTarkkaAlkamisaika')
            ? eb.validateExistence(
                'jarjestamistiedot.koulutuksenAlkamispaivamaara',
              )
            : eb,
        ),
      },
      {
        field: '.koulutuksenPaattymispaivamaara',
        validate: validateIfJulkaistu(eb =>
          eb.getValue('jarjestamistiedot.koulutuksenTarkkaAlkamisaika')
            ? eb.validateExistence(
                'jarjestamistiedot.koulutuksenPaattymispaivamaara',
              )
            : eb,
        ),
        required: true,
      },
      {
        field: '.koulutuksenAlkamiskausi',
        validate: validateIfJulkaistu(eb =>
          !eb.getValue('jarjestamistiedot.koulutuksenTarkkaAlkamisaika')
            ? eb.validateExistence('jarjestamistiedot.koulutuksenAlkamiskausi')
            : eb,
        ),
        required: true,
      },
      {
        field: '.koulutuksenAlkamisvuosi',
        validate: validateIfJulkaistu(eb =>
          !eb.getValue('jarjestamistiedot.koulutuksenTarkkaAlkamisaika')
            ? eb.validateExistence('jarjestamistiedot.koulutuksenAlkamisvuosi')
            : eb,
        ),
      },
      {
        fragment: 'diplomi',
        koulutustyypit: [KOULUTUSTYYPPI.LUKIOKOULUTUS],
      },
      {
        fragment: 'kielivalikoima',
        koulutustyypit: [KOULUTUSTYYPPI.LUKIOKOULUTUS],
      },
    ],
  },
  {
    section: 'teemakuva',
    field: 'teemakuva',
    koulutustyypit: KOULUTUSTYYPIT,
  },
  {
    section: 'nayttamistiedot',
    koulutustyypit: KOULUTUSTYYPIT,
    field: 'nayttamistiedot',
  },
  {
    section: 'tarjoajat',
    field: 'tarjoajat',
    koulutustyypit: KOULUTUSTYYPIT,
    validate: validateIfJulkaistu(eb =>
      eb.validateArrayMinLength('tarjoajat', 1),
    ),
    required: true,
  },
  {
    section: 'yhteyshenkilot',
    field: 'yhteyshenkilot',
    koulutustyypit: KOULUTUSTYYPIT,
  },
  tilaSectionConfig,
]);

const getToteutusFormConfig = koulutustyyppi => {
  return config.getKoulutustyyppiConfig(koulutustyyppi);
};

export default getToteutusFormConfig;
