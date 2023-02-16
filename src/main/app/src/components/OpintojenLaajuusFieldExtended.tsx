import React from 'react';

import Input from '@opetushallitus/virkailija-ui-components/Input';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';

import { FormFieldFloatInput, FormFieldSelect } from './formFields';
import { Box, FormControl } from './virkailija';

type Props = {
  name: string;
  disabled?: boolean;
  required?: boolean;
  fixedLaajuusYksikko?: string;
};

export const OpintojenLaajuusFieldExtended = ({
  name,
  disabled = false,
  required = false,
  fixedLaajuusYksikko,
}: Props) => {
  const { t } = useTranslation();
  const selectedLanguage = useLanguageTab();
  let { options } = useKoodistoOptions({
    koodisto: 'opintojenlaajuusyksikko',
    language: selectedLanguage,
  });

  return (
    <Box display="flex" mx={-1}>
      <Box px={1} flexGrow={1}>
        <Field
          name={`${name}.opintojenLaajuusNumero`}
          component={FormFieldFloatInput}
          label={t('koulutuslomake.valitseOpintojenLaajuus')}
          max={999}
          min={0}
          disabled={disabled}
          required={required}
          {...getTestIdProps('laajuusnumero')}
        />
      </Box>

      {fixedLaajuusYksikko ? (
        <Box px={1} flexGrow={1}>
          <FormControl label={t('yleiset.laajuusyksikko')} disabled={true}>
            <Input value={fixedLaajuusYksikko} />
          </FormControl>
        </Box>
      ) : (
        <Box px={1} flexGrow={1} {...getTestIdProps('laajuusyksikko')}>
          <Field
            name={`${name}.opintojenLaajuusyksikko`}
            component={FormFieldSelect}
            label={t('yleiset.laajuusyksikko')}
            options={options}
            disabled={disabled}
            required={required}
            isClearable
            defaultValue={{ value: fixedLaajuusYksikko }}
          />
        </Box>
      )}
    </Box>
  );
};
