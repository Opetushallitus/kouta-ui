import React, { useCallback } from 'react';

import _ from 'lodash';

import AsyncKoodistoSelect from '#/src/components/AsyncKoodistoSelect';
import { useUrls, useHttpClient } from '#/src/contexts/contextHooks';
import useLanguage from '#/src/hooks/useLanguage';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';
import getKoodi from '#/src/utils/koodi/getKoodi';

const getKoodiLabel = (koodi, language) => {
  const { koodiUri } = koodi;

  const [, postinumero] = koodiUri.split('_');

  return `${postinumero} ${_.upperFirst(
    getKoodiNimiTranslation(koodi, language).toLowerCase()
  )}`;
};

const getKoodiOption = (koodi, versio, language) => {
  const { koodiUri } = koodi;

  return {
    label: getKoodiLabel(koodi, language),
    value: `${koodiUri}#${versio}`,
  };
};

export const PostinumeroSelect = ({ koodistoVersio = 2, ...props }) => {
  const httpClient = useHttpClient();
  const apiUrls = useUrls();
  const language = useLanguage();

  const formatLabel = useCallback(
    koodi => {
      return getKoodiLabel(koodi, language);
    },
    [language]
  );

  const loadOptions = useCallback(
    async inputValue => {
      if (!_.isString(inputValue)) {
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
          return [getKoodiOption(koodi, koodistoVersio, language)];
        }
      } catch (e) {
        console.log(e);
      }

      return [];
    },
    [httpClient, apiUrls, language, koodistoVersio]
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
