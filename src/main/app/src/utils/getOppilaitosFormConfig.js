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
    section: 'teemakuva',
    field: 'teemakuva',
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

const getOppilaitosFormConfig = () => config.getConfig();

export default getOppilaitosFormConfig;
