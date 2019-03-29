import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';

const createLocalisation = ({
  loadLocalisation,
  language = 'fi',
  fallbackLng = 'fi',
  debug = false,
  defaultNS = 'kouta',
  ns = ['kouta'],
}) => {
  let instance = i18n.createInstance();

  if (loadLocalisation) {
    instance = instance.use(XHR);
  }

  instance.init({
    lng: language,
    fallbackLng,
    debug,
    defaultNS,
    ns,
    ...(loadLocalisation && {
      backend: {
        loadPath: '{{ns}}:{{lng}}',
        ajax: (url, options, callback) => {
          const [namespace, language] = url.split(':');

          loadLocalisation({ namespace, language })
            .then(data => {
              callback(data, { status: '200' });
            })
            .catch(() => callback(null, { status: '404' }));
        },
        parse: data => data,
      },
    }),
  });

  return instance;
};

export default createLocalisation;
