import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';
import { FormFieldSelect, FormFieldEditor } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';

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
