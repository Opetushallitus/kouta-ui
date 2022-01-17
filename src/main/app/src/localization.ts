import { StatusCodes } from 'http-status-codes';
import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import _ from 'lodash';

import { LANGUAGES } from '#/src/constants';
import getTranslations from '#/src/translations';
import { getLocalization } from '#/src/utils/api/getLocalization';

const { REACT_APP_LANG } = process.env;

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

type CreateLocalizationProps = {
  loadLocalization?: (props: { namespace: string; language: string }) => any;
  fallbackLng?: LanguageCode;
  language?: LanguageCode;
  debug?: boolean;
  defaultNS?: string;
  ns?: Array<string>;
};

const createLocalization = ({
  loadLocalization,
  fallbackLng = 'fi',
  language = 'fi',
  debug = false,
  defaultNS = 'kouta',
  ns = ['kouta'],
}: CreateLocalizationProps) => {
  let instance = i18n.createInstance();

  if (!REACT_APP_LANG && loadLocalization) {
    instance = instance.use(XHR);
  }

  instance.init({
    fallbackLng,
    debug,
    defaultNS,
    preload: LANGUAGES,
    lng: REACT_APP_LANG ?? language,
    ns,
    ...(!REACT_APP_LANG &&
      loadLocalization && {
        backend: {
          loadPath: '{{ns}}:{{lng}}',
          ajax: (url, options, callback) => {
            const [namespace, language] = url.split(':');

            loadLocalization({ namespace, language })
              .then(data => {
                callback(data, { status: StatusCodes.OK });
              })
              .catch(() => callback(null, { status: StatusCodes.NOT_FOUND }));
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

export const createDefaultLocalization = ({ httpClient, apiUrls }) => {
  return createLocalization({
    debug: isDev,
    loadLocalization: async ({ namespace, language }) => {
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
    },
  });
};

export default createLocalization;
