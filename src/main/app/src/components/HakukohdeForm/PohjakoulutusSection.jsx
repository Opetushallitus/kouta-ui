import React from 'react';
import { Field } from 'redux-form';

import useKoodistoOptions from '../useKoodistoOptions';
import { getTestIdProps } from '../../utils';
import useTranslation from '../useTranslation';
import { FormFieldSelect, FormFieldEditor } from '../formFields';
import Box from '../Box';

const PohjakoulutusSection = ({ name, language }) => {
  const { options } = useKoodistoOptions({
    koodisto: 'pohjakoulutuskouta',
  });

  const { t } = useTranslation();

  return (
    <>
      <Box {...getTestIdProps('pohjakoulutusvaatimusSelect')} mb={2}>
        <Field
          name={`${name}.pohjakoulutusvaatimus`}
          component={FormFieldSelect}
          options={options}
          label={t('hakukohdelomake.valitsePohjakoulutusvaatimus')}
          isMulti
        />
      </Box>

      <Box {...getTestIdProps('pohjakoulutusTarkenne')}>
        <Field
          name={`${name}.tarkenne.${language}`}
          component={FormFieldEditor}
          label={t('hakukohdelomake.pohjakoulutuksenTarkennus')}
        />
      </Box>
    </>
  );
};

export default PohjakoulutusSection;
