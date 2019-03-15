import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import Select from '../Select';
import { noop } from '../../utils';

import useKoodistoOptions from '../useKoodistoOptions';

const renderSelectField = ({ input, ...props }) => (
  <Select {...input} {...props} onBlur={noop} />
);

const OsaamistaustaSection = () => {
  const { options } = useKoodistoOptions({ koodisto: 'osaamistausta' });

  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        Valitse, mikä osaamistausta hakijalla pitää olla
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
