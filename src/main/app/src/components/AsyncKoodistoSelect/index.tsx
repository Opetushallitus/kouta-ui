import React, { useCallback, useMemo } from 'react';
import { isFunction } from 'lodash';

import { AsyncSelect } from '#/src/components/Select';
import getKoodi from '#/src/utils/koodi/getKoodi';
import useLanguage from '#/src/hooks/useLanguage';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';
import { useUrls, useHttpClient } from '#/src/contexts/contextHooks';

const AsyncKoodistoSelect = ({
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
    return isFunction(formatLabelProp)
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
