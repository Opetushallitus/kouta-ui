import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import { get, capitalize, toLower, isFunction } from 'lodash';

const formatMap = {
  toLower,
  capitalize,
  unCapitalize: value => {
    const low = toLower(value);
    // if second character changes, return original value
    return get(value, 1) === get(low, 1) ? low : value;
  },
};

const createLocalisation = ({
  loadLocalisation,
  fallbackLng = 'fi',
  language = 'fi',
  debug = false,
  defaultNS = 'kouta',
  ns = ['kouta'],
}) => {
  let instance = i18n.createInstance();

  if (loadLocalisation) {
    instance = instance.use(XHR);
  }

  instance.init({
    fallbackLng,
    debug,
    defaultNS,
    lng: language,
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
    interpolation: {
      format(value, format, lng) {
        return isFunction(formatMap[format]) ? formatMap[format](value) : value;
      },
    },
  });

  return instance;
};

export default createLocalisation;
