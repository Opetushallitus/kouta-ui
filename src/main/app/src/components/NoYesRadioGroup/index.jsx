import React, { useMemo, useCallback } from 'react';

import { RadioGroup } from '../Radio';
import { isBoolean, noop } from '../../utils';
import useTranslation from '../useTranslation';

const getRadioValue = value => {
  if (!isBoolean(value)) {
    return '';
  }

  return value ? 'kylla' : 'ei';
};

const getValue = radioValue => {
  return radioValue === 'kylla' ? true : false;
};

const getOptions = t => [
  { value: 'kylla', label: t('yleiset.kylla') },
  { value: 'ei', label: t('yleiset.ei') },
];

export const NoYesRadioGroup = ({ value, onChange = noop, ...props }) => {
  const { t } = useTranslation();
  const options = useMemo(() => getOptions(t), [t]);

  const onRadioGroupChange = useCallback(
    e => {
      onChange(getValue(e.target.value));
    },
    [onChange],
  );

  return (
    <RadioGroup
      value={getRadioValue(value)}
      options={options}
      onChange={onRadioGroupChange}
    />
  );
};

export default NoYesRadioGroup;
