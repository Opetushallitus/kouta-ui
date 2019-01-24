import React from 'react';
import { Field } from 'redux-form';
import getYear from 'date-fns/get_year';

import Typography from '../Typography';
import Spacing from '../Spacing';
import LanguageSelector from '../LanguageSelector';
import Radio, { RadioGroup } from '../Radio';
import NativeSelect, { Option } from '../NativeSelect';

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

const kausiOptions = [
  { value: 'kevat', label: 'Kevät' },
  { value: 'kesa', label: 'Kesä' },
  { value: 'syksy', label: 'Syksy' },
];

const yearOptions = [...new Array(10)].map((value, index) => ({
  value: `${currentYear + index}`,
  label: `${currentYear + index}`,
}));

const renderYearField = ({ input }) => (
  <NativeSelect {...input}>
    <Option value="">Valitse vuosi</Option>
    {yearOptions.map(({ value, label }) => (
      <Option value={value} key={value}>{label}</Option>
    ))}
  </NativeSelect>
);

const AlkamiskausiSection = () => {
  return (
    <>
      <Spacing marginBottom={2}>
        <Typography variant="h6" marginBottom={1}>
          Kausi
        </Typography>
        <Field
          name="kausi"
          component={renderRadioGroupField}
          options={kausiOptions}
        />
      </Spacing>
      <Spacing>
        <Typography variant="h6" marginBottom={1}>
          Vuosi
        </Typography>
        <Field name="vuosi" component={renderYearField} />
      </Spacing>
    </>
  );
};

export default AlkamiskausiSection;
