import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { getTestIdProps } from '#/src/utils';

import { useLanguageTab } from '../contexts/LanguageTabContext';
import useKoodistoOptions from '../hooks/useKoodistoOptions';
import {
  FormFieldFloatInput,
  FormFieldHardcoded,
  FormFieldSelect,
} from './formFields';
import { Box } from './virkailija';

export const OpintojenLaajuusFieldExtended = ({
  name,
  disabled,
  required = false,
  hardcodedLaajuusYksikko = '',
}) => {
  const { t } = useTranslation();
  const selectedLanguage = useLanguageTab();
  let { options } = useKoodistoOptions({
    koodisto: 'opintojenlaajuusyksikko',
    language: selectedLanguage,
  });

  let component = FormFieldSelect;

  if (hardcodedLaajuusYksikko) {
    options = options.filter(o => o.value === hardcodedLaajuusYksikko);
    console.log('hardcoded laajuus!', options);
    component = FormFieldHardcoded(options[0]?.value);
  }

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

      <Box px={1} flexGrow={1} {...getTestIdProps('laajuusyksikko')}>
        <Field
          name={`${name}.opintojenLaajuusyksikko`}
          component={component}
          label={t('yleiset.laajuusyksikko')}
          options={options}
          disabled={disabled}
          required={required}
          isClearable
        />
      </Box>
    </Box>
  );
};
