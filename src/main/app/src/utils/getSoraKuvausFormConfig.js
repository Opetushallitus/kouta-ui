import createFormConfigBuilder from './createFormConfigBuilder';

import {
  validateIfJulkaistu,
  getKielivalinta,
  koulutustyyppiSectionConfig,
  kieliversiotSectionConfig,
  pohjaValintaSectionConfig,
  tilaSectionConfig,
  julkinenSectionConfig,
} from '#/src/utils/formConfigUtils';

const config = createFormConfigBuilder().registerSections([
  koulutustyyppiSectionConfig,
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
  julkinenSectionConfig,
  tilaSectionConfig,
]);

const getSoraKuvausFormConfig = () => config.getConfig();

export default getSoraKuvausFormConfig;
