import React, { useState } from 'react';

import { storiesOf } from '@storybook/react';

import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import useLoadOptions from '#/src/hooks/useLoadOptions';

import AsyncKoodistoSelect from './index';

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

storiesOf('AsyncKoodistoSelect', module).add('Basic', () => <Story />);
