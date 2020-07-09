import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import _ from 'lodash';
import { getLocalization } from '#/src/utils/api/getLocalization';
import getTranslations from '#/src/translations';
import { LANGUAGES } from '#/src/constants';

const formatMap = {
  toLower: _.toLower,
  upperFirst: _.upperFirst,
  unCapitalize: value => {
    const low = _.toLower(value);
    // if second character changes, return original value
    return _.get(value, 1) === _.get(low, 1) ? low : value;
  },
  default: _.identity,
};

const createLocalization = ({
  loadLocalization,
  fallbackLng = 'fi',
  language = 'fi',
  debug = false,
  defaultNS = 'kouta',
  ns = ['kouta'],
}) => {
  let instance = i18n.createInstance();

  if (loadLocalization) {
    instance = instance.use(XHR);
  }

  instance.init({
    fallbackLng,
    debug,
    defaultNS,
    preload: LANGUAGES,
    lng: language,
    ns,
    ...(loadLocalization && {
      backend: {
        loadPath: '{{ns}}:{{lng}}',
        ajax: (url, options, callback) => {
          const [namespace, language] = url.split(':');

          loadLocalization({ namespace, language })
            .then(data => {
              callback(data, { status: '200' });
            })
            .catch(() => callback(null, { status: '404' }));
        },
        parse: data => data,
      },
    }),
    interpolation: {
      format(value, format = 'default', lng) {
        return _.isFunction(formatMap[format])
          ? formatMap[format](value)
          : value;
      },
    },
  });

  return instance;
};

const isDev = process.env.NODE_ENV === 'development';

const createLocalizationLoader = ({ httpClient, apiUrls }) => async ({
  namespace,
  language,
}) => {
  const localization = await getLocalization({
    category: namespace,
    locale: language,
    httpClient,
    apiUrls,
  });

  const translations = getTranslations();

  return _.get(translations, [language, namespace])
    ? _.merge({}, translations[language][namespace], localization || {})
    : localization;
};

let localizationInstance = null;

export const createDefaultLocalization = ({ httpClient, apiUrls }) => {
  localizationInstance = createLocalization({
    debug: isDev,
    loadLocalization: createLocalizationLoader({ httpClient, apiUrls }),
  });
  return localizationInstance;
};

export const getDefaultLocalization = () => localizationInstance;

export default createLocalization;
