import i18n from 'i18next';

const createLocalisation = ({
  resources = {},
  language = 'fi',
  fallbackLng = 'fi',
  debug = false,
}) => {
  const instance = i18n.createInstance();

  instance.init({
    lng: language,
    resources,
    fallbackLng,
    debug,
  });

  return instance;
};

export default createLocalisation;
