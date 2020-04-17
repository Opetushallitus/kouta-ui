import createFormConfigBuilder from './createFormConfigBuilder';

const config = createFormConfigBuilder().registerSections([
  {
    section: 'kieliversiot',
    field: 'kieliversiot',
    validate: eb => eb.validateArrayMinLength('kieliversiot', 1),
    required: true,
  },
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
  {
    section: 'tila',
    field: 'tila',
  },
]);

const getOppilaitosFormConfig = () => config.getConfig();

export default getOppilaitosFormConfig;
