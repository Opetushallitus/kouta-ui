import React, { useCallback } from 'react';

import { isFunction } from 'lodash';

import { AsyncSelect, SelectProps } from '#/src/components/Select';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useKoodistoDataOptions } from '#/src/hooks/useKoodistoOptions';
import useLoadOptions from '#/src/hooks/useLoadOptions';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';
import getKoodi from '#/src/utils/koodi/getKoodi';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';

type AsyncKoodistoSelectProps = {
  formatKoodiLabel: (k: Koodi, lng?: LanguageCode) => string;
  loadLabel: (value: string) => Promise<string>;
  koodistoData: Array<Koodi>;
  loadOptions: (value: string) => Promise<SelectOptions>;
  showAllOptions?: boolean;
  selectedLanguage?: LanguageCode;
} & SelectProps;

export const AsyncKoodistoSelect = ({
  formatKoodiLabel,
  loadLabel: loadLabelProp,
  koodistoData,
  loadOptions: loadOptionsProp,
  showAllOptions = false,
  selectedLanguage,
  ...props
}: AsyncKoodistoSelectProps) => {
  const userLanguage = useUserLanguage();

  const usedLanguage = selectedLanguage ? selectedLanguage : userLanguage;

  const options = useKoodistoDataOptions({
    koodistoData,
    formatLabel: formatKoodiLabel,
    language: usedLanguage,
  });

  const loadOptions = useLoadOptions(options);
  const apiUrls = useUrls();
  const httpClient = useHttpClient();

  const loadLabel = useCallback(
    async value => {
      if (isFunction(loadLabelProp)) {
        return loadLabelProp(value);
      } else {
        const { koodi, versio } = parseKoodiUri(value);

        if (koodi) {
          const koodiObj = await getKoodi({
            httpClient,
            apiUrls,
            koodi,
            versio,
            silent: true,
          });

          return (
            formatKoodiLabel?.(koodiObj, usedLanguage) ??
            getKoodiNimiTranslation(koodiObj, usedLanguage)
          );
        }
      }
    },
    [httpClient, apiUrls, loadLabelProp, usedLanguage, formatKoodiLabel]
  );
  return (
    <AsyncSelect
      loadOptions={loadOptionsProp ?? loadOptions}
      loadLabel={loadLabel}
      defaultOptions={showAllOptions && options}
      {...props}
    />
  );
};

export default AsyncKoodistoSelect;
