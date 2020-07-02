import createFormConfigBuilder from './createFormConfigBuilder';
import {
  kieliversiotSectionConfig,
  tilaSectionConfig,
} from '#/src/utils/formConfigUtils';

const config = createFormConfigBuilder().registerSections([
  kieliversiotSectionConfig,
  {
    section: 'perustiedot',
    field: 'perustiedot',
  },
  {
    section: 'esittely',
    field: 'esittely',
  },
  {
    section: 'tietoa',
    field: 'tietoa',
  },
  {
    section: 'yhteystiedot',
    field: 'yhteystiedot',
  },
  tilaSectionConfig,
]);

const getOppilaitoksenOsaFormConfig = () => config.getConfig();

export default getOppilaitoksenOsaFormConfig;
