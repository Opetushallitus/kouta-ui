import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import _ from 'lodash';
import { getLocalisation } from './apiUtils';
import getTranslations from './translations';
import { LANGUAGES } from '#/src/constants';

const formatMap = {
  toLower: _.toLower,
  capitalize: _.capitalize,
  unCapitalize: value => {
    const low = _.toLower(value);
    // if second character changes, return original value
    return _.get(value, 1) === _.get(low, 1) ? low : value;
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
    preload: LANGUAGES,
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
        return _.isFunction(formatMap[format])
          ? formatMap[format](value)
          : value;
      },
    },
  });

  return instance;
};

const isDev = process.env.NODE_ENV === 'development';

const createLocalisationLoader = ({ httpClient, apiUrls }) => async ({
  namespace,
  language,
}) => {
  const localisation = await getLocalisation({
    category: namespace,
    locale: language,
    httpClient,
    apiUrls,
  });

  const translations = getTranslations();

  return _.get(translations, [language, namespace])
    ? _.merge({}, translations[language][namespace], localisation || {})
    : localisation;
};

let localisationInstance = null;

export const createDefaultLocalisation = ({ httpClient, apiUrls }) => {
  localisationInstance = createLocalisation({
    debug: isDev,
    loadLocalisation: createLocalisationLoader({ httpClient, apiUrls }),
  });
  return localisationInstance;
};

export const getDefaultLocalisation = () => localisationInstance;

export default createLocalisation;
