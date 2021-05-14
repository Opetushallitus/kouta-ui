import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldSelect, FormFieldEditor } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';

export const PohjakoulutusSection = ({ name, language }) => {
  const { options } = useKoodistoOptions({
    koodisto: 'pohjakoulutusvaatimuskouta',
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
          required
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
