import React from 'react';
import { Field } from 'redux-form';

import { getTestIdProps } from '../../../utils';
import useTranslation from '../../useTranslation';
import { FormFieldDatePickerInput, FormFieldRadioGroup } from '../../formFields';
import Box from '../../Box';
import useKoodistoOptions from '../../useKoodistoOptions';

const AlkamiskausiFields = ({ name }) => {
  const { t } = useTranslation();
  const { options } = useKoodistoOptions({ koodisto: 'kausi' });

  return (
    <Box display="flex" m={-1}>
      <Box
      flexGrow="1"
      p={1}
      {...getTestIdProps('koulutuksenAlkamiskausi')}
      >
        <Field
            name={`${name}.kausi`}
            component={FormFieldRadioGroup}
            label={t('yleiset.kausi')}
            options={options}
        />
      </Box>
      <Box
        flexGrow="1"
        p={1}
        {...getTestIdProps('koulutuksenAlkamispaivamaara')}
      >
        <Field
          name={`${name}.koulutuksenAlkamispaivamaara`}
          component={FormFieldDatePickerInput}
          label={t('yleiset.alkaa')}
        />
      </Box>
      <Box
        flexGrow="1"
        p={1}
        {...getTestIdProps('koulutuksenPaattymispaivamaara')}
      >
        <Field
          name={`${name}.koulutuksenPaattymispaivamaara`}
          component={FormFieldDatePickerInput}
          label={t('yleiset.paattyy')}
        />
      </Box>
    </Box>
  );
};

export default AlkamiskausiFields;
