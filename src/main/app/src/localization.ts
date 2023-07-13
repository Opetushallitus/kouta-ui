import { StatusCodes } from 'http-status-codes';
import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import _ from 'lodash';
import { initReactI18next } from 'react-i18next';

import { LANGUAGES } from '#/src/constants';
import getTranslations from '#/src/translations';
import { getLocalization } from '#/src/utils/api/getLocalization';

import { isPlaywright } from './utils';

const { REACT_APP_CIMODE } = process.env;

const isCimode = REACT_APP_CIMODE || isPlaywright;

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
  i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
      fallbackLng,
      debug,
      defaultNS,
      preload: LANGUAGES,
      lng: isCimode ? 'cimode' : language,
      ns,
      ...(!isCimode &&
        loadLocalization && {
          backend: {
            loadPath: '{{ns}}:{{lng}}',
            request: (options, url, payload, callback) => {
              const [namespace, language] = url.split(':');

              loadLocalization({ namespace, language })
                .then(data => {
                  callback(null, { status: StatusCodes.OK, data });
                })
                .catch(() => callback({ status: StatusCodes.NOT_FOUND }));
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
