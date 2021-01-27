import React, { useMemo, useContext, useRef, useCallback } from 'react';
import { components, Props } from 'react-select';
import ReactCreatable from 'react-select/creatable';
import ReactAsyncCreatableSelect from 'react-select/async-creatable';
import ReactAsyncSelect from 'react-select/async';
import { ThemeContext } from 'styled-components';
import { useAsync } from 'react-async';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import UiSelect, {
  getStyles,
  getTheme,
} from '@opetushallitus/virkailija-ui-components/Select';

import { memoizeOne } from '#/src/utils/memoize';

const OptionComponent = props => (
  <components.Option
    {...props}
    innerProps={{ ...props.innerProps, role: 'option' }}
  />
);

const noopPromise = () => Promise.resolve();

const makeDefaultNoOptionsMessage = t => () =>
  t('yleiset.eiValittaviaKohteita');

const makeDefaultFormatCreateLabel = t => value =>
  t('yleiset.luoKohde', { kohde: value });

const makeDefaultPlaceholder = t => t('yleiset.valitseVaihtoehdoista');

const defaultLoadingMessage = t => () => t('yleiset.ladataan');

const getDefaultProps = memoizeOne(t => ({
  isClearable: true,
  formatCreateLabel: makeDefaultFormatCreateLabel(t),
  noOptionsMessage: makeDefaultNoOptionsMessage(t),
  placeholder: makeDefaultPlaceholder(t),
  loadingMessage: defaultLoadingMessage(t),
  className: 'Select__',
  components: {
    Option: OptionComponent,
  },
}));

const getOptionLabelByValue = options => {
  if (!_.isArray(options)) {
    return {};
  }

  return options.reduce((acc, curr) => {
    acc[curr.value || '_'] = curr.label;

    return acc;
  }, {});
};

const getValue = (value, options) => {
  const hasOptions = _.isArray(options);

  if (_.isObject(value) && value.value) {
    return hasOptions
      ? options.find(option => option?.value === value.value) || {
          label: value.value,
          ...value,
        }
      : { label: value.value, ...value };
  }

  if (_.isArray(value)) {
    const labelByValue = getOptionLabelByValue(options);

    return value
      .map(item => {
        if (_.isObject(item) && item.value) {
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

type SelectProps = Props & {
  id?: string;
  error?: boolean;
};

export const Select = ({
  id,
  disabled,
  value,
  options,
  error = false,
  ...props
}: SelectProps) => {
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

export const CreatableSelect = ({ error = false, id, disabled, ...props }) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);

  return (
    <ReactCreatable
      {...getDefaultProps(t)}
      styles={getStyles(theme, error)}
      theme={getTheme(theme)}
      inputId={id}
      isDisabled={disabled}
      {...props}
    />
  );
};

export const AsyncCreatableSelect = ({
  error = false,
  id,
  disabled,
  ...props
}) => {
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
      isDisabled={disabled}
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
    const valueArr = _.castArray(valueProp);

    return valueArr
      .filter(v => !v?.label && !labelCache.current[v?.value])
      .map(v => v?.value);
  }, [valueProp]);

  const promiseFn = useMemo(() => {
    return async () => {
      const labels = await Promise.all(
        valuesWithoutLabel.map(v =>
          (_.isFunction(loadLabel) ? loadLabel(v) : noopPromise()).catch(
            () => null
          )
        )
      );

      const valueToLabel = _.zipObject(valuesWithoutLabel, labels);

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
      isDisabled={disabled || _.isUndefined(props?.loadOptions)}
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
