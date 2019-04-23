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
import useTranslation from '../useTranslation';

const getStyles = memoize((theme, error) => ({
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
  control: provided => {
    const isActive = !!provided.boxShadow;

    return {
      ...provided,
      ...(!isActive && {
        boxShadow: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.1)',
        borderColor: error ? theme.palette.danger.main : theme.palette.border,
      }),
      borderRadius: '2px',
    };
  },
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? 'white' : theme.palette.text.primary,
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;

    return { ...provided, opacity, color: theme.palette.text.primary };
  },
}));

const makeDefaultNoOptionsMessage = t => () =>
  t('yleiset.eiValittaviaKohteita');

const makeDefaultFormatCreateLabel = t => value =>
  t('yleiset.luoKohde', { kohde: value });

const makeDefaultPlaceholder = t => `${t('yleiset.valitse')}...`;

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

const getDefaultProps = memoize((theme, t, error) => ({
  formatCreateLabel: makeDefaultFormatCreateLabel(t),
  noOptionsMessage: makeDefaultNoOptionsMessage(t),
  placeholder: makeDefaultPlaceholder(t),
  loadingMessage: defaultLoadingMessage,
  styles: getStyles(theme, error),
  theme: getTheme(theme),
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
    <ReactSelect
      {...getDefaultProps(theme, t, error)}
      value={resolvedValue}
      options={options}
      inputId={id}
      {...props}
    />
  );
};

const CreatableBase = ({ theme, ...props }) => {
  const { t } = useTranslation();

  return <ReactCreatable {...getDefaultProps(theme, t)} {...props} />;
};

const AsyncCreatableBase = ({ theme, ...props }) => {
  const { t } = useTranslation();

  return (
    <ReactAsyncCreatableSelect
      {...getDefaultProps(theme, t)}
      cacheOptions={true}
      {...props}
    />
  );
};

const AsyncSelectBase = ({ theme, ...props }) => {
  const { t } = useTranslation();

  return (
    <ReactAsyncSelect
      {...getDefaultProps(theme, t)}
      cacheOptions={true}
      {...props}
    />
  );
};

export const CreatableSelect = withTheme(CreatableBase);

export const AsyncCreatableSelect = withTheme(AsyncCreatableBase);

export const AsyncSelect = withTheme(AsyncSelectBase);

export default withTheme(Select);
