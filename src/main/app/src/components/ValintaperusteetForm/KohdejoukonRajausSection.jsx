import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import Select from '../Select';
import { noop } from '../../utils';

import useKoodistoOptions from '../useKoodistoOptions';

const renderSelectField = ({ input, ...props }) => (
  <Select {...input} {...props} onBlur={noop} />
);

const KohdejoukonRajausSection = () => {
  const { options } = useKoodistoOptions({ koodisto: 'haunkohdejoukko' });

  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        Valitse kohdejoukko
      </Typography>

      <Field
        name="kohdejoukko"
        component={renderSelectField}
        options={options}
      />
    </>
  );
};

export default KohdejoukonRajausSection;
