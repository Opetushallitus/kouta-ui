import { KOULUTUSTYYPIT } from '#/src/constants';
import createFormConfigBuilder from '#/src/utils/form/createFormConfigBuilder';

import {
  validateIfJulkaistu,
  getKielivalinta,
  kieliversiotSectionConfig,
  pohjaValintaSectionConfig,
  tilaSectionConfig,
  julkinenSectionConfig,
} from '#/src/utils/form/formConfigUtils';
import { validateExistence } from '../form/createErrorBuilder';

const config = createFormConfigBuilder().registerSections([
  {
    koulutustyypit: KOULUTUSTYYPIT,
    section: 'koulutustyyppi',
    required: true,
    parts: [
      {
        field: 'koulutustyyppi',
        required: true,
        validate: validateExistence('koulutustyyppi'),
      },
      {
        field: 'koulutusala',
        required: true,
        validate: validateExistence('koulutusala'),
      },
      {
        field: 'koulutukset',
      },
    ],
  },
  pohjaValintaSectionConfig,
  kieliversiotSectionConfig,
  {
    section: 'tiedot',
    parts: [
      {
        field: '.nimi',
        validate: validateIfJulkaistu((eb, values) =>
          eb.validateTranslations('tiedot.nimi', getKielivalinta(values))
        ),
        required: true,
      },
      {
        field: '.kuvaus',
        validate: validateIfJulkaistu((eb, values) =>
          eb.validateTranslations('tiedot.kuvaus', getKielivalinta(values))
        ),
        required: true,
      },
    ],
  },
  tilaSectionConfig,
]);

const getSoraKuvausFormConfig = () => config.getConfig();

export default getSoraKuvausFormConfig;
