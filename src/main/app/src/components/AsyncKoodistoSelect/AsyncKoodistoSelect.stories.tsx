import React, { useState } from 'react';

import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import useLoadOptions from '#/src/hooks/useLoadOptions';

import AsyncKoodistoSelect from './index';

const Story = () => {
  const { options } = useKoodistoOptions({ koodisto: 'posti', versio: 2 });

  const loadOptions = useLoadOptions(options);

  const [value, setValue] = useState<Array<SelectOption<string>>>([
    { label: 'posti_00940', value: 'posti_00940#2' },
    { label: 'posti_99870', value: 'posti_99870#2' },
  ]);

  return (
    <AsyncKoodistoSelect
      onChange={v => setValue(old => (Array.isArray(v) ? [...old, v] : old))}
      value={value}
      loadOptions={loadOptions}
      isMulti
    />
  );
};

export default {
  title: 'AsyncKoodistoSelect',
};

export const Basic = () => <Story />;
