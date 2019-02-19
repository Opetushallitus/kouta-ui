import React from 'react';
import { Field, formValues } from 'redux-form';

import Typography from '../Typography';
import Radio, { RadioGroup } from '../Radio';
import { HAKU_LOMAKETYYPPI_OPTIONS } from '../../constants';
import Flex, { FlexItem } from '../Flex';
import Select from '../Select';

const renderHakulomaketyyppiField = ({ input, options }) => (
  <RadioGroup {...input}>
    {options.map(({ label, value }) => (
      <Radio value={value} key={value}>
        {label}
      </Radio>
    ))}
  </RadioGroup>
);

const HakulomakeTyyppiFieldValue = formValues('lomaketyyppi')(
  ({ lomaketyyppi, children }) => children({ lomaketyyppi }),
);

const LomakeSelect = ({ lomaketyyppi }) => (
  <>
    <Typography variant="h6" marginBottom={1}>
      Valitse hakulomake
    </Typography>
    <Select />
  </>
);

const LomakeSection = () => {
  return (
    <Flex>
      <FlexItem grow={0} basis="30%">
        <Typography variant="h6" marginBottom={1}>
          Valitse mitä hakulomaketta käytetään
        </Typography>
        <Field
          name="lomaketyyppi"
          component={renderHakulomaketyyppiField}
          options={HAKU_LOMAKETYYPPI_OPTIONS}
        />
      </FlexItem>
      <FlexItem grow={1} paddingLeft={2}>
        <HakulomakeTyyppiFieldValue>
          {({ lomaketyyppi }) =>
            lomaketyyppi && lomaketyyppi !== 'ei_hakua' ? (
              <LomakeSelect lomaketyyppi={lomaketyyppi} />
            ) : null
          }
        </HakulomakeTyyppiFieldValue>
      </FlexItem>
    </Flex>
  );
};

export default LomakeSection;
