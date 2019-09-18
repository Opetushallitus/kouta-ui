import React, { useCallback, useContext } from 'react';
import upperFirst from 'lodash/upperFirst';

import UrlContext from '../UrlContext';
import HttpContext from '../HttpContext';
import AsyncKoodistoSelect from '../AsyncKoodistoSelect';
import { isString } from '../../utils';
import useLanguage from '../useLanguage';
import getKoodi from '../../utils/koodistoService/getKoodi';
import getKoodiNimiTranslation from '../../utils/getKoodiNimiTranslation';

const getKoodiLabel = (koodi, language) => {
  const { koodiUri } = koodi;

  const [, postinumero] = koodiUri.split('_');

  return `${postinumero} ${upperFirst(
    getKoodiNimiTranslation(koodi, language).toLowerCase(),
  )}`;
};

const getKoodiOption = (koodi, versio, language) => {
  const { koodiUri } = koodi;

  return {
    label: getKoodiLabel(koodi, language),
    value: `${koodiUri}#${versio}`,
  };
};

const PostinumeroSelect = ({ koodistoVersio = 2, ...props }) => {
  const httpClient = useContext(HttpContext);
  const apiUrls = useContext(UrlContext);
  const language = useLanguage();

  const formatLabel = useCallback(
    koodi => {
      return getKoodiLabel(koodi, language);
    },
    [language],
  );

  const loadOptions = useCallback(
    async inputValue => {
      if (!isString(inputValue)) {
        return [];
      }

      const koodiStr = `posti_${inputValue}`;

      try {
        const koodi = await getKoodi({
          httpClient,
          apiUrls,
          koodi: koodiStr,
          versio: koodistoVersio,
          silent: true,
        });

        if (koodi) {
          return [getKoodiOption(koodi, language)];
        }
      } catch (e) {
        console.log(e);
      }

      return [];
    },
    [httpClient, apiUrls, language, koodistoVersio],
  );

  return (
    <AsyncKoodistoSelect
      isClearable={true}
      formatLabel={formatLabel}
      loadOptions={loadOptions}
      {...props}
    />
  );
};

export default PostinumeroSelect;
