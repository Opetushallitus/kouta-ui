import React, { useContext, useCallback, useMemo } from 'react';

import { AsyncSelect } from '../Select';
import getKoodi from '../../utils/koodistoService/getKoodi';
import HttpContext from '../HttpContext';
import UrlContext from '../UrlContext';
import useLanguage from '../useLanguage';
import getKoodiNimiTranslation from '../../utils/getKoodiNimiTranslation';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';
import { isFunction } from '../../utils';

const AsyncKoodistoSelect = ({
  disabled,
  formatLabel: formatLabelProp,
  language: selectedLanguage,
  ...props
}) => {
  const httpClient = useContext(HttpContext);
  const apiUrls = useContext(UrlContext);
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
    [httpClient, apiUrls, formatLabel],
  );

  return <AsyncSelect disabled={disabled} loadLabel={loadLabel} {...props} />;
};

export default AsyncKoodistoSelect;
