import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import Select from '../Select';
import { noop } from '../../utils';
import useKoodistoOptions from '../useKoodistoOptions';
import useTranslation from '../useTranslation';

const renderSelectField = ({ input, ...props }) => (
  <Select {...input} {...props} onBlur={noop} />
);

const OsaamistaustaSection = () => {
  const { options } = useKoodistoOptions({ koodisto: 'osaamistausta' });
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        {t('valintaperustelomake.valitseOsaamistausta')}
      </Typography>

      <Field
        name="osaamistausta"
        component={renderSelectField}
        options={options}
        isMulti
      />
    </>
  );
};

export default OsaamistaustaSection;
