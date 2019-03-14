import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import Spacing from '../Spacing';
import { RadioGroup } from '../Radio';
import useKoodistoOptions from '../useKoodistoOptions';
import YearSelect from '../YearSelect';

const renderRadioGroupField = ({ input, options }) => (
  <RadioGroup {...input} options={options} />
);

const renderYearField = ({ input }) => <YearSelect {...input} />;

const AlkamiskausiSection = () => {
  const { options } = useKoodistoOptions({ koodisto: 'kausi' });

  return (
    <>
      <Spacing marginBottom={2}>
        <Typography variant="h6" marginBottom={1}>
          Kausi
        </Typography>

        <Field
          name="kausi"
          component={renderRadioGroupField}
          options={options}
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
