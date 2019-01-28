import React from 'react';
import { Field, formValues } from 'redux-form';

import Typography from '../Typography';
import Radio, { RadioGroup } from '../Radio';
import { HAKUKOHDE_LOMAKETYYPPI_OPTIONS } from '../../constants';
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

const HakulomakeTyyppiFieldValue = formValues('hakulomakeTyyppi')(
  ({ hakulomakeTyyppi, children }) => children({ hakulomakeTyyppi }),
);

const LomakeSelect = ({ hakulomakeTyyppi }) => (
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
          name="hakulomakeTyyppi"
          component={renderHakulomaketyyppiField}
          options={HAKUKOHDE_LOMAKETYYPPI_OPTIONS}
        />
      </FlexItem>
      <FlexItem grow={1} paddingLeft={2}>
        <HakulomakeTyyppiFieldValue>
          {({ hakulomakeTyyppi }) =>
            hakulomakeTyyppi && hakulomakeTyyppi !== 'ei_hakua' ? (
              <LomakeSelect hakulomakeTyyppi={hakulomakeTyyppi} />
            ) : null
          }
        </HakulomakeTyyppiFieldValue>
      </FlexItem>
    </Flex>
  );
};

export default LomakeSection;
