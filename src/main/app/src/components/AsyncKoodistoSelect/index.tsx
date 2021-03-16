import React, { useCallback } from 'react';

import _ from 'lodash';

import { AsyncSelect } from '#/src/components/Select';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useKoodistoDataOptions } from '#/src/hooks/useKoodistoOptions';
import useLoadOptions from '#/src/hooks/useLoadOptions';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';
import getKoodi from '#/src/utils/koodi/getKoodi';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';

export const AsyncKoodistoSelect = ({
  formatKoodiLabel,
  language,
  loadLabel: loadLabelProp,
  koodistoData,
  loadOptions: loadOptionsProp,
  showAllOptions = false,
  ...props
}) => {
  const options = useKoodistoDataOptions({
    koodistoData,
    language,
    formatLabel: formatKoodiLabel,
  });

  const loadOptions = useLoadOptions(options);
  const apiUrls = useUrls();
  const httpClient = useHttpClient();

  const loadLabel = useCallback(
    async value => {
      if (_.isFunction(loadLabelProp)) {
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
            formatKoodiLabel?.(koodiObj, language) ??
            getKoodiNimiTranslation(koodiObj, language)
          );
        }
      }
    },
    [httpClient, apiUrls, loadLabelProp, language, formatKoodiLabel]
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
