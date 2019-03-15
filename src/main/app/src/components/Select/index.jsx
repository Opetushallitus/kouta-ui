import React, { useMemo } from 'react';
import ReactSelect from 'react-select';
import ReactCreatable from 'react-select/lib/Creatable';
import ReactAsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
import ReactAsyncSelect from 'react-select/lib/Async';
import { withTheme } from 'styled-components';
import { setLightness } from 'polished';
import memoize from 'memoizee';
import get from 'lodash/get';

import { isArray, isObject, isString } from '../../utils';

const getStyles = memoize(theme => ({
  container: provided => ({
    ...provided,
    fontFamily: theme.typography.fontFamily,
  }),
  menuPortal: provided => {
    return {
      ...provided,
      fontFamily: theme.typography.fontFamily,
      zIndex: 9999,
    };
  },
  menu: provided => ({
    ...provided,
    zIndex: 3,
  }),
}));

const defaultNoOptionsMessage = () => 'Valittavia kohteita ei löytynyt';

const defaultFormatCreateLabel = value => `Luo kohde "${value}"`;

const defaultPlaceholder = 'Valitse...';

const defaultLoadingMessage = () => 'Ladataan...';

const getTheme = memoize(theme => {
  const {
    palette: {
      primary: { main: primaryMain },
    },
  } = theme;

  return selectTheme => ({
    ...selectTheme,
    colors: {
      ...selectTheme.colors,
      primary: primaryMain,
      primary25: setLightness(0.9, primaryMain),
      primary50: setLightness(0.8, primaryMain),
    },
  });
});

const getDefaultProps = memoize(theme => ({
  formatCreateLabel: defaultFormatCreateLabel,
  noOptionsMessage: defaultNoOptionsMessage,
  placeholder: defaultPlaceholder,
  loadingMessage: defaultLoadingMessage,
  styles: getStyles(theme),
  theme: getTheme(theme),
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

const Select = ({ theme, value, options, ...props }) => {
  const resolvedValue = useMemo(() => getValue(value, options), [
    value,
    options,
  ]);

  return (
    <ReactSelect
      {...getDefaultProps(theme)}
      value={resolvedValue}
      options={options}
      {...props}
    />
  );
};

const CreatableBase = ({ theme, ...props }) => (
  <ReactCreatable {...getDefaultProps(theme)} {...props} />
);

const AsyncCreatableBase = ({ theme, ...props }) => (
  <ReactAsyncCreatableSelect
    {...getDefaultProps(theme)}
    cacheOptions={true}
    {...props}
  />
);

const AsyncSelectBase = ({ theme, ...props }) => (
  <ReactAsyncSelect
    {...getDefaultProps(theme)}
    cacheOptions={true}
    {...props}
  />
);

export const CreatableSelect = withTheme(CreatableBase);

export const AsyncCreatableSelect = withTheme(AsyncCreatableBase);

export const AsyncSelect = withTheme(AsyncSelectBase);

export default withTheme(Select);
