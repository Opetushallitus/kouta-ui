import i18n from 'i18next';

const createLocalisation = ({
  resources = {},
  language = 'fi',
  debug = false,
}) => {
  const instance = i18n.createInstance();

  instance.init({
    lng: language,
    resources,
    debug,
  });

  return instance;
};

export default createLocalisation;
