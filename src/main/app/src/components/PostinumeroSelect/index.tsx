import React, { useCallback } from 'react';

import _ from 'lodash';

import AsyncKoodistoSelect from '#/src/components/AsyncKoodistoSelect';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import useLanguage from '#/src/hooks/useLanguage';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';
import getKoodi from '#/src/utils/koodi/getKoodi';

const VALID_POSTINUMERO_LENGTH = 5;

const koodiToKoodiUri = koodi => `${koodi?.koodiUri}#${koodi.versio}`;

const getKoodiLabel = (koodi, language) => {
  const postinumero = koodi?.koodiArvo;

  return `${postinumero} ${_.upperFirst(
    getKoodiNimiTranslation(koodi, language).toLowerCase()
  )}`;
};

export const PostinumeroSelect = ({ ...props }) => {
  const httpClient = useHttpClient();
  const apiUrls = useUrls();
  const language = useLanguage();

  const loadOptions = useCallback(
    async inputValue => {
      if (_.size(inputValue) === VALID_POSTINUMERO_LENGTH) {
        const koodi = await getKoodi({
          httpClient,
          apiUrls,
          koodi: `posti_${_.trim(inputValue)}`,
          silent: true,
        });

        if (koodi) {
          return [
            {
              label: getKoodiLabel(koodi, language),
              value: koodiToKoodiUri(koodi),
            },
          ];
        }
      }

      return [];
    },
    [httpClient, apiUrls, language]
  );

  return (
    <AsyncKoodistoSelect
      isClearable={true}
      formatKoodiLabel={getKoodiLabel}
      loadOptions={loadOptions}
      {...props}
    />
  );
};

export default PostinumeroSelect;
