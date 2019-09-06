import React, { useMemo, useContext } from 'react';
import ReactCreatable from 'react-select/lib/Creatable';
import ReactAsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
import ReactAsyncSelect from 'react-select/lib/Async';
import { ThemeContext } from 'styled-components';

import UiSelect, {
  getStyles,
  getTheme,
} from '@opetushallitus/virkailija-ui-components/Select';

import get from 'lodash/get';

import memoizeOne from '../../utils/memoizeOne';
import { isArray, isString, isObject } from '../../utils';
import useTranslation from '../useTranslation';

const makeDefaultNoOptionsMessage = t => () =>
  t('yleiset.eiValittaviaKohteita');

const makeDefaultFormatCreateLabel = t => value =>
  t('yleiset.luoKohde', { kohde: value });

const makeDefaultPlaceholder = t => `${t('yleiset.valitse')}...`;

const defaultLoadingMessage = () => 'Ladataan...';

const getDefaultProps = memoizeOne(t => ({
  formatCreateLabel: makeDefaultFormatCreateLabel(t),
  noOptionsMessage: makeDefaultNoOptionsMessage(t),
  placeholder: makeDefaultPlaceholder(t),
  loadingMessage: defaultLoadingMessage,
  className: 'Select__',
}));

const getOptionLabelByValue = options => {
  return options.reduce((acc, curr) => {
    acc[curr.value || '_'] = curr.label;

    return acc;
  }, {});
};

const getValue = (value, options) => {
  const hasOptions = isArray(options);

  if (isString(value)) {
    return options.find(option => get(option, 'value') === value) || value;
  }

  if (isObject(value) && value.value && hasOptions) {
    return !value.label
      ? options.find(option => get(option, 'value') === value.value) || null
      : value;
  }

  if (isArray(value) && hasOptions) {
    const labelByValue = getOptionLabelByValue(options);

    return value
      .map(item => {
        if (isString(item)) {
          return {
            value: item,
            label: labelByValue[item] || ' ',
          };
        } else if (isObject(item)) {
          const { value: itemValue, label: itemLabel, ...rest } = item;

          return {
            value: itemValue,
            label: itemLabel || labelByValue[itemValue] || ' ',
            ...rest,
          };
        }

        return {
          value: null,
        };
      })
      .filter(({ value: v }) => !!v);
  }

  return value;
};

const Select = ({ theme, value, options, id, error = false, ...props }) => {
  const resolvedValue = useMemo(() => getValue(value, options), [
    value,
    options,
  ]);

  const { t } = useTranslation();

  return (
    <UiSelect
      {...getDefaultProps(t)}
      value={resolvedValue}
      options={options}
      inputId={id}
      {...props}
    />
  );
};

export const CreatableSelect = ({ error = false, ...props }) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);

  return (
    <ReactCreatable
      {...getDefaultProps(t)}
      styles={getStyles(theme, error)}
      theme={getTheme(theme)}
      {...props}
    />
  );
};

export const AsyncCreatableSelect = ({ error = false, ...props }) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);

  return (
    <ReactAsyncCreatableSelect
      {...getDefaultProps(t)}
      styles={getStyles(theme, error)}
      theme={getTheme(theme)}
      cacheOptions={true}
      {...props}
    />
  );
};

export const AsyncSelect= ({ error = false, ...props }) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);

  return (
    <ReactAsyncSelect
      {...getDefaultProps(t)}
      styles={getStyles(theme, error)}
      theme={getTheme(theme)}
      cacheOptions={true}
      {...props}
    />
  );
};

export default Select;
