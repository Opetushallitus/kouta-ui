import React, { useMemo, useContext, useRef } from 'react';
import ReactCreatable from 'react-select/lib/Creatable';
import ReactAsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
import ReactAsyncSelect from 'react-select/lib/Async';
import { ThemeContext } from 'styled-components';
import { useAsync } from 'react-async';
import zipObject from 'lodash/zipObject';

import UiSelect, {
  getStyles,
  getTheme,
} from '@opetushallitus/virkailija-ui-components/Select';

import get from 'lodash/get';

import memoizeOne from '../../utils/memoizeOne';
import { isArray, isString, isObject, isFunction } from '../../utils';
import useTranslation from '../useTranslation';

const noopPromise = () => Promise.resolve();

const makeDefaultNoOptionsMessage = t => () =>
  t('yleiset.eiValittaviaKohteita');

const makeDefaultFormatCreateLabel = t => value =>
  t('yleiset.luoKohde', { kohde: value });

const makeDefaultPlaceholder = t => t('yleiset.valitseVaihtoehdoista');

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
      error={error}
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
      placeholder={t('yleiset.kirjoitaHakusana')}
      styles={getStyles(theme, error)}
      theme={getTheme(theme)}
      cacheOptions={true}
      {...props}
    />
  );
};

export const AsyncSelect = ({
  error = false,
  loadLabel,
  value: valueProp,
  isLoading,
  ...props
}) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const labelCache = useRef({});

  const valuesWithoutLabel = useMemo(() => {
    const valueArr = isArray(valueProp) ? valueProp : [valueProp];

    return valueArr
      .filter(v => !get(v, 'label') && !labelCache.current[get(v, 'value')])
      .map(v => get(v, 'value'));
  }, [valueProp]);

  const promiseFn = useMemo(() => {
    return async () => {
      const labels = await Promise.all(
        valuesWithoutLabel.map(v =>
          (isFunction(loadLabel) ? loadLabel(v) : noopPromise()).catch(
            () => null,
          ),
        ),
      );

      const valueToLabel = zipObject(valuesWithoutLabel, labels);

      labelCache.current = {
        ...labelCache.current,
        ...valueToLabel,
      };

      return labelCache.current;
    };
  }, [valuesWithoutLabel, loadLabel]);

  const { data: valueToLabel, isLoading: labelIsLoading } = useAsync({
    promiseFn,
  });

  const value = useMemo(() => {
    return getValue(
      valueProp,
      Object.entries(valueToLabel || {}).map(([k, v]) => ({
        value: k,
        label: v,
      })),
    );
  }, [valueToLabel, valueProp]);

  return (
    <ReactAsyncSelect
      {...getDefaultProps(t)}
      placeholder={t('yleiset.kirjoitaHakusana')}
      styles={getStyles(theme, error)}
      theme={getTheme(theme)}
      cacheOptions={true}
      value={value}
      isLoading={labelIsLoading || isLoading}
      {...props}
    />
  );
};

export default Select;
