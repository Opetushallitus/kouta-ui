import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import useKoodistoOptions from '../useKoodistoOptions';
import Select from '../Select';
import { noop } from '../../utils';
import useTranslation from '../useTranslation';

const renderSelectField = ({ input, options, ...rest }) => (
  <Select {...input} options={options} {...rest} onBlur={noop} />
);

const PohjakoulutusSection = () => {
  const { options } = useKoodistoOptions({
    koodisto: 'pohjakoulutusvaatimustoinenaste',
  });

  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        {t('hakukohdelomake.valitsePohjakoulutusvaatimus')}
      </Typography>

      <Field
        name="koulutusvaatimukset"
        component={renderSelectField}
        options={options}
        isMulti
      />
    </>
  );
};

export default PohjakoulutusSection;
