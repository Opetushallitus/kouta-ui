import createFormConfigBuilder from '#/src/utils/form/createFormConfigBuilder';
import {
  kieliversiotSectionConfig,
  tilaSectionConfig,
} from '#/src/utils/form/formConfigUtils';

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
  {
    section: 'esikatselu',
    field: 'esikatselu',
  },
]);

const getOppilaitosFormConfig = () => config.getConfig();

export default getOppilaitosFormConfig;