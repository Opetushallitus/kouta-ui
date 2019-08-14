import React from 'react';
import { Field } from 'redux-form';

import Box from '../../Box';
import { FormFieldTextarea } from '../../FormFields';
import LukionLinjaFields from './LukionLinjaFields';
import useTranslation from '../../useTranslation';
import { getTestIdProps } from '../../../utils';

export const LukiolinjatSection = ({ language, name }) => {
  const { t } = useTranslation();

  return (
    <>
      <Box mb={2}>
        <LukionLinjaFields name={name} />
      </Box>
      <div {...getTestIdProps('jaksonKuvaus')}>
        <Field
          name={`${name}.jaksonKuvaus.${language}`}
          component={FormFieldTextarea}
          label={t('toteutuslomake.jaksonKuvaus')}
        />
      </div>
    </>
  );
};

export default LukiolinjatSection;
