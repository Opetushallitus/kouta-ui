import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import AsyncKoodistoSelect from './index';
import useKoodistoOptions from '../useKoodistoOptions';
import useLoadOptions from '../useLoadOptions';

import {
  makeApiDecorator,
  makeLocalisationDecorator,
} from '../../storybookUtils';

const Story = () => {
  const { options } = useKoodistoOptions({ koodisto: 'posti', versio: 2 });

  const loadOptions = useLoadOptions(options);

  const [value, setValue] = useState([
    { value: 'posti_00940#2' },
    { value: 'posti_99870#2' },
  ]);

  return (
    <AsyncKoodistoSelect
      onChange={setValue}
      value={value}
      loadOptions={loadOptions}
      isMulti
    />
  );
};

storiesOf('AsyncKoodistoSelect', module)
  .addDecorator(makeLocalisationDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => <Story />);
