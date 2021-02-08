import _fp from 'lodash/fp';

import {
  KOULUTUSTYYPPI,
  KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
} from '#/src/constants';
import { validateExistence } from '#/src/utils/form/createErrorBuilder';
import createFormConfigBuilder from '#/src/utils/form/createFormConfigBuilder';
import {
  validateIfJulkaistu,
  getKielivalinta,
  koulutustyyppiSectionConfig,
  kieliversiotSectionConfig,
  pohjaValintaSectionConfig,
  tilaSectionConfig,
  julkinenSectionConfig,
  createOptionalTranslatedFieldConfig,
} from '#/src/utils/form/formConfigUtils';

const getMinTarjoajat = values => {
  return values?.minTarjoajat ?? 1;
};

const oneAndOnlyOneTutkinnonOsa = values =>
  values?.tutkinnonosat?.osat?.length === 1;

const config = createFormConfigBuilder().registerSections([
  koulutustyyppiSectionConfig,
  pohjaValintaSectionConfig,
  kieliversiotSectionConfig,
  {
    section: 'tutkinnonosat',
    koulutustyypit: [KOULUTUSTYYPPI.TUTKINNON_OSA],
    parts: [
      {
        field: '.osat',
        fragment: 'osat',
        koulutustyypit: [KOULUTUSTYYPPI.TUTKINNON_OSA],
        validate: eb =>
          eb.validateArray('tutkinnonosat.osat', eb => {
            return _fp.flow([
              eb => eb.validateExistence('eperuste'),
              eb => eb.validateExistence('koulutus'),
              eb => eb.validateArrayMinLength('osat', 1),
            ])(eb);
          }),
        required: true,
      },
      {
        field: '.nimi',
        koulutustyypit: [KOULUTUSTYYPPI.TUTKINNON_OSA],
        validate: (eb, values) =>
          oneAndOnlyOneTutkinnonOsa(values)
            ? eb
            : eb.validateTranslations(
                'tutkinnonosat.nimi',
                getKielivalinta(values)
              ),
        required: true,
      },
    ],
  },
  {
    section: 'osaamisala',
    koulutustyypit: [KOULUTUSTYYPPI.OSAAMISALA],
    field: 'osaamisala',
    parts: [
      {
        field: '.koulutus',
        validate: validateExistence('osaamisala.koulutus'),
        required: true,
      },
      {
        field: '.eperuste',
        validate: validateExistence('osaamisala.eperuste'),
        required: true,
      },
      {
        field: '.osaamisala',
        validate: validateExistence('osaamisala.osaamisala'),
        required: true,
      },
    ],
  },
  {
    section: 'osaamisalanKuvaus',
    koulutustyypit: [KOULUTUSTYYPPI.OSAAMISALA],
    field: 'osaamisalanKuvaus',
  },
  {
    section: 'information',
    parts: [
      {
        field: '.koulutus',
        fragment: 'koulutuskoodiTiedoilla',
        koulutustyypit: TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
        validate: eb => eb.validateExistence('information.koulutus'),
        required: true,
      },
      {
        field: '.eperuste',
        koulutustyypit: TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
        validate: validateIfJulkaistu(eb =>
          eb.validateExistence('information.eperuste')
        ),
        required: true,
      },
      {
        field: '.koulutus',
        fragment: 'koulutuskoodi',
        koulutustyypit: [
          ...TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
          KOULUTUSTYYPPI.VALMA,
          KOULUTUSTYYPPI.TELMA,
          KOULUTUSTYYPPI.LUVA,
          KOULUTUSTYYPPI.PERUSOPETUKSEN_LISAOPETUS,
        ],
        validate: eb => eb.validateExistence('information.koulutus'),
        required: true,
      },
      {
        field: '.koulutus',
        fragment: 'osaamisala',
        koulutustyypit: [KOULUTUSTYYPPI.LUKIOKOULUTUS],
        validate: eb => eb.validateExistence('information.koulutus'),
        required: true,
      },
      {
        field: '.nimi',
        koulutustyypit: [
          ...TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
          KOULUTUSTYYPPI.AVOIN_YO,
          KOULUTUSTYYPPI.AVOIN_AMK,
          KOULUTUSTYYPPI.TAYDENNYS_KOULUTUS,
          KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS,
          KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJAKOULUTUS,
          KOULUTUSTYYPPI.AMMATILLINEN_ERITYISOPETTAJA_KOULUTUS,
          KOULUTUSTYYPPI.AMMATILLINEN_OPINTO_OHJAAJA_KOULUTUS,
        ],
        validate: (eb, values) =>
          eb.validateTranslations('information.nimi', getKielivalinta(values)),
        required: true,
      },
      {
        field: '.opintojenLaajuus',
        koulutustyypit: TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
      },
      {
        field: '.tutkintonimike',
        koulutustyypit: TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
      },
      {
        field: '.koulutusalat',
        koulutustyypit: TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
      },
    ],
  },
  {
    section: 'description',
    parts: [
      {
        field: '.nimi',
        koulutustyypit: TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
        required: true,
        validate: validateIfJulkaistu((eb, values) =>
          eb.validateTranslations('description.nimi', getKielivalinta(values))
        ),
      },
      createOptionalTranslatedFieldConfig({
        name: 'description.kuvaus',
        koulutustyypit: TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
      }),
      {
        fragment: 'tekstiKuvaus',
        koulutustyypit: [
          ...TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
          KOULUTUSTYYPPI.LUKIOKOULUTUS,
        ],
      },
    ],
  },
  {
    section: 'lisatiedot',
    koulutustyypit: KOULUTUSTYYPIT,
    parts: [
      {
        field: '.osiot',
      },
      {
        field: '.osioKuvaukset',
      },
    ],
  },
  {
    section: 'teemakuva',
    field: 'teemakuva',
    koulutustyypit: KOULUTUSTYYPIT,
  },
  {
    section: 'tarjoajat',
    koulutustyypit: KOULUTUSTYYPIT,
    parts: [
      {
        field: '.tarjoajat',
        validate: validateIfJulkaistu((eb, values) =>
          eb.validateArrayMinLength(
            'tarjoajat.tarjoajat',
            getMinTarjoajat(values)
          )
        ),
        required: true,
      },
      {
        field: '.kaytaPohjanJarjestajaa',
        required: false,
      },
    ],
  },
  julkinenSectionConfig,
  tilaSectionConfig,
]);

const getKoulutusFormConfig = koulutustyyppi => {
  return config.getKoulutustyyppiConfig(koulutustyyppi);
};

export default getKoulutusFormConfig;
