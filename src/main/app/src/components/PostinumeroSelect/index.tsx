import React, { useCallback } from 'react';

import _ from 'lodash';

import AsyncKoodistoSelect from '#/src/components/AsyncKoodistoSelect';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { getKoodi } from '#/src/utils/koodi/getKoodi';
import { getPostinumeroKoodiLabel } from '#/src/utils/koodi/postinumero';

const VALID_POSTINUMERO_LENGTH = 5;

const koodiToKoodiUri = koodi => `${koodi?.koodiUri}#${koodi.versio}`;

export const PostinumeroSelect = ({ ...props }) => {
  const httpClient = useHttpClient();
  const apiUrls = useUrls();
  const language = useUserLanguage();

  const loadOptions = useCallback(
    async (inputValue: string) => {
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
              label: getPostinumeroKoodiLabel(koodi, language),
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
      formatKoodiLabel={getPostinumeroKoodiLabel}
      loadOptions={loadOptions}
      {...props}
    />
  );
};

export default PostinumeroSelect;
