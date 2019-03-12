import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import Spacing from '../Spacing';
import Radio, { RadioGroup } from '../Radio';
import useKoodistoOptions from '../useKoodistoOptions';
import YearSelect from '../YearSelect';
import { noop } from '../../utils';

const renderRadioGroupField = ({ input, options }) => (
  <RadioGroup {...input}>
    {options.map(({ value, label }) => (
      <Radio value={value} key={value}>
        {label}
      </Radio>
    ))}
  </RadioGroup>
);

const renderYearField = ({ input }) => <YearSelect {...input} onBlur={noop} />;

const AlkamiskausiFields = ({ name }) => {
  const { options } = useKoodistoOptions({ koodisto: 'kausi' });

  return (
    <>
      <Spacing marginBottom={2}>
        <Typography as="div" marginBottom={1}>
          Kausi
        </Typography>

        <Field
          name={`${name}.kausi`}
          component={renderRadioGroupField}
          options={options}
        />
      </Spacing>
      <Spacing>
        <Typography as="div" marginBottom={1}>
          Vuosi
        </Typography>
        <Field name={`${name}.vuosi`} component={renderYearField} />
      </Spacing>
    </>
  );
};

export default AlkamiskausiFields;
