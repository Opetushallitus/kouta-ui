import React, { useMemo, useContext, useRef, useCallback } from 'react';
import ReactCreatable from 'react-select/creatable';
import ReactAsyncCreatableSelect from 'react-select/async-creatable';
import ReactAsyncSelect from 'react-select/async';
import { ThemeContext } from 'styled-components';
import { useAsync } from 'react-async';
import { get, isArray, isObject, isFunction, zipObject } from 'lodash';

import UiSelect, {
  getStyles,
  getTheme,
} from '@opetushallitus/virkailija-ui-components/Select';

import memoizeOne from '../../utils/memoizeOne';
import { useTranslation } from 'react-i18next';

const noopPromise = () => Promise.resolve();

const makeDefaultNoOptionsMessage = t => () =>
  t('yleiset.eiValittaviaKohteita');

const makeDefaultFormatCreateLabel = t => value =>
  t('yleiset.luoKohde', { kohde: value });

const makeDefaultPlaceholder = t => t('yleiset.valitseVaihtoehdoista');

const defaultLoadingMessage = () => 'Ladataan...';

const getDefaultProps = memoizeOne(t => ({
  isClearable: true,
  formatCreateLabel: makeDefaultFormatCreateLabel(t),
  noOptionsMessage: makeDefaultNoOptionsMessage(t),
  placeholder: makeDefaultPlaceholder(t),
  loadingMessage: defaultLoadingMessage,
  className: 'Select__',
}));

const getOptionLabelByValue = options => {
  if (!isArray(options)) {
    return {};
  }

  return options.reduce((acc, curr) => {
    acc[curr.value || '_'] = curr.label;

    return acc;
  }, {});
};

const getValue = (value, options) => {
  const hasOptions = isArray(options);

  if (isObject(value) && value.value) {
    return hasOptions
      ? options.find(option => get(option, 'value') === value.value) || {
          label: value.value,
          ...value,
        }
      : { label: value.value, ...value };
  }

  if (isArray(value)) {
    const labelByValue = getOptionLabelByValue(options);

    return value
      .map(item => {
        if (isObject(item) && item.value) {
          const { value: itemValue, label: itemLabel, ...rest } = item;

          return {
            value: itemValue,
            label: itemLabel || labelByValue[itemValue] || itemValue,
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

const Select = ({
  disabled,
  theme,
  value,
  options,
  id,
  error = false,
  ...props
}) => {
  const resolvedValue = useMemo(() => getValue(value, options), [
    value,
    options,
  ]);

  const { t } = useTranslation();

  return (
    <UiSelect
      {...getDefaultProps(t)}
      isDisabled={disabled}
      value={resolvedValue}
      options={options}
      inputId={id}
      error={error}
      {...props}
    />
  );
};

export const CreatableSelect = ({ error = false, id, ...props }) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);

  return (
    <ReactCreatable
      {...getDefaultProps(t)}
      styles={getStyles(theme, error)}
      theme={getTheme(theme)}
      inputId={id}
      {...props}
    />
  );
};

export const AsyncCreatableSelect = ({ error = false, id, ...props }) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);

  return (
    <ReactAsyncCreatableSelect
      {...getDefaultProps(t)}
      placeholder={t('yleiset.kirjoitaHakusana')}
      styles={getStyles(theme, error)}
      theme={getTheme(theme)}
      cacheOptions={true}
      inputId={id}
      {...props}
    />
  );
};

export const AsyncSelect = ({
  disabled,
  error = false,
  loadLabel,
  value: valueProp,
  isLoading,
  id,
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
            () => null
          )
        )
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
      }))
    );
  }, [valueToLabel, valueProp]);

  const noOptionsMessage = useCallback(
    () => t('yleiset.eiValittaviaKohteitaHakusanalla'),
    [t]
  );

  return (
    <ReactAsyncSelect
      {...getDefaultProps(t)}
      isDisabled={disabled}
      placeholder={t('yleiset.kirjoitaHakusana')}
      noOptionsMessage={noOptionsMessage}
      styles={getStyles(theme, error)}
      theme={getTheme(theme)}
      cacheOptions={true}
      value={value}
      isLoading={labelIsLoading || isLoading}
      inputId={id}
      {...props}
    />
  );
};

export default Select;
