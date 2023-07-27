import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FixedValueKoodiInput } from '#/src/components/FixedValueKoodiInput';
import { OpintojenLaajuusyksikko } from '#/src/constants';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import { useKoodistoOptions } from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';

import { FormFieldFloatInput, FormFieldSelect } from './formFields';
import { Box } from './virkailija';

type Props = {
  name: string;
  disabled?: boolean;
  required?: boolean;
  fixedLaajuusYksikko?: OpintojenLaajuusyksikko;
};

export const OpintojenLaajuusFieldExtended = ({
  name,
  disabled = false,
  required = false,
  fixedLaajuusYksikko,
}: Props) => {
  const { t } = useTranslation();
  const selectedLanguage = useLanguageTab();
  const { options } = useKoodistoOptions({
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
          <FixedValueKoodiInput
            koodiUri={fixedLaajuusYksikko}
            selectedLanguage={selectedLanguage}
            label={t('yleiset.laajuusyksikko')}
          />
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
          />
        </Box>
      )}
    </Box>
  );
};
