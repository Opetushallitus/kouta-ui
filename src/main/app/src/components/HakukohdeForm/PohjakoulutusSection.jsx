import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import useKoodistoOptions from '../useKoodistoOptions';
import Select from '../Select';
import { noop, getTestIdProps } from '../../utils';
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

      <div {...getTestIdProps('pohjakoulutusvaatimusSelect')}>
        <Field
          name="koulutusvaatimukset"
          component={renderSelectField}
          options={options}
          isMulti
        />
      </div>
    </>
  );
};

export default PohjakoulutusSection;
