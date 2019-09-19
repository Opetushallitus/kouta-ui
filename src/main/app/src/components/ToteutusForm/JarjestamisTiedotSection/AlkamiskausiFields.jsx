import React from 'react';
import { Field } from 'redux-form';

import { getTestIdProps } from '../../../utils';
import useTranslation from '../../useTranslation';
import { FormFieldDatePickerInput } from '../../formFields';
import Box from '../../Box';

const AlkamiskausiFields = ({ name }) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" m={-1}>
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
