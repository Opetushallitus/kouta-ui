import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldAsyncCreatableSelect } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { getLuokittelutermit } from '#/src/utils/api/getLuokittelutermitSearch';

export const LuokittelutermitField = ({
  language,
  name,
}: {
  language: string;
  name: string;
}) => {
  const { t } = useTranslation();

  const httpClient = useHttpClient();
  const apiUrls = useUrls();

  const loadOptions = useCallback(
    async (inputValue: string) => {
      const termit = await getLuokittelutermit({
        httpClient,
        apiUrls,
        searchStr: inputValue,
        language,
      });

      return termit.map((termi: string): { value: string; label: string } => {
        return {
          value: termi,
          label: termi,
        };
      });
    },
    [httpClient, apiUrls, language]
  );

  return (
    <Box>
      <Field
        name={`${name}.luokittelutermit`}
        component={FormFieldAsyncCreatableSelect}
        isMulti
        isClearable
        loadOptions={loadOptions}
        label={t('koulutuslomake.luokittelutermit')}
        helperText={t('koulutuslomake.luokittelutermitOhje')}
      />
    </Box>
  );
};
