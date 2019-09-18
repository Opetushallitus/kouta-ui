import React, { useContext, useCallback, useMemo } from 'react';

import { AsyncSelect } from '../Select';
import getKoodi from '../../utils/koodistoService/getKoodi';
import HttpContext from '../HttpContext';
import UrlContext from '../UrlContext';
import useLanguage from '../useLanguage';
import getKoodiNimiTranslation from '../../utils/getKoodiNimiTranslation';
import parseKoodiUri from '../../utils/parseKoodiUri';
import { isFunction } from '../../utils';

const AsyncKoodistoSelect = ({ formatLabel: formatLabelProp, ...props }) => {
  const httpClient = useContext(HttpContext);
  const apiUrls = useContext(UrlContext);
  const language = useLanguage();

  const formatLabel = useMemo(() => {
    return isFunction(formatLabelProp)
      ? formatLabelProp
      : koodi => getKoodiNimiTranslation(koodi, language);
  }, [language, formatLabelProp]);

  const loadLabel = useCallback(
    async value => {
      const { koodi, versio } = parseKoodiUri(value);

      if (!koodi || !versio) {
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

  return <AsyncSelect loadLabel={loadLabel} {...props} />;
};

export default AsyncKoodistoSelect;
