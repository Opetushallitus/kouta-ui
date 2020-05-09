import React, { useMemo, useCallback } from 'react';
import { isBoolean, noop } from 'lodash';
import { RadioGroup } from '../Radio';
import { useTranslation } from 'react-i18next';

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

export const NoYesRadioGroup = ({
  value,
  onChange = noop,
  onBlur,
  options: optionsProp,
  ...props
}) => {
  const { t } = useTranslation();
  const options = useMemo(() => (optionsProp ? optionsProp : getOptions(t)), [
    optionsProp,
    t,
  ]);

  const onRadioGroupChange = useCallback(
    e => {
      onChange(getValue(e.target.value));
    },
    [onChange]
  );

  return (
    <RadioGroup
      value={getRadioValue(value)}
      options={options}
      onChange={onRadioGroupChange}
      {...props}
    />
  );
};

export default NoYesRadioGroup;
