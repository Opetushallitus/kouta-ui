import React, { useEffect } from 'react';

import Input from '@opetushallitus/virkailija-ui-components/Input';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import { useBoundFormActions, useFieldValue } from '#/src/hooks/form';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';

import { FormFieldFloatInput, FormFieldSelect } from './formFields';
import { Box, FormControl } from './virkailija';

type Props = {
  name: string;
  disabled?: boolean;
  required?: boolean;
  defaultLaajuusYksikko?: string;
};

export const OpintojenLaajuusFieldExtended = ({
  name,
  disabled = false,
  required = false,
  defaultLaajuusYksikko,
  defaultLaajuusNumero,
}: Props) => {
  const { t } = useTranslation();
  const selectedLanguage = useLanguageTab();
  let { options } = useKoodistoOptions({
    koodisto: 'opintojenlaajuusyksikko',
    language: selectedLanguage,
  });

  const { change } = useBoundFormActions();
  const currLaajuusNumero = useFieldValue(`${name}.opintojenLaajuusNumero`);

  useEffect(() => {
    if (_.isUndefined(currLaajuusNumero)) {
      change(`${name}.opintojenLaajuusNumero`, defaultLaajuusNumero);
    }
  }, [change, currLaajuusNumero, name, defaultLaajuusNumero]);

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

      {defaultLaajuusYksikko ? (
        <Box px={1} flexGrow={1}>
          <FormControl label={t('yleiset.laajuusyksikko')} disabled={true}>
            <Input value={defaultLaajuusYksikko} />
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
            defaultValue={{ value: defaultLaajuusYksikko }}
          />
        </Box>
      )}
    </Box>
  );
};
