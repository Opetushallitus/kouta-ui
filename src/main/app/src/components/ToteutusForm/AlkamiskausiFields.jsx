import React from 'react';
import { Field } from 'redux-form';
import getYear from 'date-fns/get_year';

import Typography from '../Typography';
import Spacing from '../Spacing';
import Radio, { RadioGroup } from '../Radio';
import NativeSelect, { Option } from '../NativeSelect';
import useKoodistoOptions from '../useKoodistoOptions';

const renderRadioGroupField = ({ input, options }) => (
  <RadioGroup {...input}>
    {options.map(({ value, label }) => (
      <Radio value={value} key={value}>
        {label}
      </Radio>
    ))}
  </RadioGroup>
);

const currentYear = getYear(new Date());

const yearOptions = [...new Array(10)].map((value, index) => ({
  value: `${currentYear + index}`,
  label: `${currentYear + index}`,
}));

const renderYearField = ({ input }) => (
  <NativeSelect {...input}>
    <Option value="">Valitse vuosi</Option>
    {yearOptions.map(({ value, label }) => (
      <Option value={value} key={value}>
        {label}
      </Option>
    ))}
  </NativeSelect>
);

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
