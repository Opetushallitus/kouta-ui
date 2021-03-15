import React, { useCallback, useMemo } from 'react';

import _ from 'lodash';

import { AsyncSelect } from '#/src/components/Select';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import useLanguage from '#/src/hooks/useLanguage';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';
import getKoodi from '#/src/utils/koodi/getKoodi';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';

export const AsyncKoodistoSelect = ({
  disabled,
  formatLabel: formatLabelProp,
  language: selectedLanguage,
  ...props
}) => {
  const httpClient = useHttpClient();
  const apiUrls = useUrls();
  const userLanguage = useLanguage();
  const language = selectedLanguage || userLanguage;

  const formatLabel = useMemo(() => {
    return _.isFunction(formatLabelProp)
      ? formatLabelProp
      : koodi => getKoodiNimiTranslation(koodi, language);
  }, [language, formatLabelProp]);

  const loadLabel = useCallback(
    async value => {
      const { koodi, versio } = parseKoodiUri(value);

      if (!koodi) {
        return undefined;
      }

      try {
        const koodiObj = await getKoodi({
          httpClient,
          apiUrls,
          koodi,
          versio,
          silent: true,
        });

        return formatLabel(koodiObj);
      } catch {
        return undefined;
      }
    },
    [httpClient, apiUrls, formatLabel]
  );

  return <AsyncSelect disabled={disabled} loadLabel={loadLabel} {...props} />;
};

export default AsyncKoodistoSelect;
