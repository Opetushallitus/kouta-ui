import React, { useMemo, useContext, useCallback } from 'react';

import UiSelect, {
  getStyles,
  getTheme,
} from '@opetushallitus/virkailija-ui-components/Select';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { components, Props } from 'react-select';
import ReactAsyncSelect from 'react-select/async';
import ReactAsyncCreatableSelect from 'react-select/async-creatable';
import ReactCreatable from 'react-select/creatable';
import { ThemeContext } from 'styled-components';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { valueToArray, safeArrayToValue } from '#/src/utils';
import { memoizeOne } from '#/src/utils/memoize';

const OptionComponent = props => (
  <components.Option
    {...props}
    innerProps={{
      ...props.innerProps,
      role: 'option',
      style: { whiteSpace: 'pre-wrap' },
    }}
  />
);

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

const getOptionLabelByValue = (options: Array<any> = []) =>
  _.reduce(
    options,
    (acc, curr) => {
      acc[curr?.value || '_'] = curr?.label || curr?.value;
      return acc;
    },
    {}
  );

const getAsyncValue = async (
  value?: SelectOption | SelectOptions | null,
  options?: Array<any>,
  loadLabel: any = _.identity
) => {
  const newValue = valueToArray(getValue(value, options));
  const result = await Promise.all(
    newValue.map(async singleValue => ({
      ...singleValue,
      label:
        singleValue?.label === singleValue?.value
          ? (await loadLabel(singleValue?.value).catch(() => undefined)) ??
            singleValue?.value
          : singleValue?.label,
    }))
  );

  return safeArrayToValue(result);
};

const getValue = (
  value?: SelectOption | SelectOptions | null,
  options?: Array<any>
) => {
  const labelByValue = getOptionLabelByValue(options);
  if (_.isArray(value)) {
    const newValue: SelectOptions = [];

    for (const item of value) {
      if (_.isObject(item) && item.value) {
        const { value: itemValue, label: itemLabel, ...rest } = item;

        newValue.push({
          ...rest,
          value: itemValue,
          label: labelByValue[itemValue] || itemLabel || itemValue,
        });
      }
    }

    return newValue;
  } else if (value?.value) {
    return { ...value, label: labelByValue[value.value] || value.value };
  }

  return value;
};

export type SelectProps = {
  id?: string;
  error?: boolean;
} & Props<SelectOption<string>, boolean>;

export const Select = ({
  id,
  disabled,
  value,
  options,
  error = false,
  ...props
}: SelectProps) => {
  const resolvedValue = useMemo(
    () => getValue(value, options as any),
    [value, options]
  );

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
  defaultOptions,
  ...props
}: SelectProps) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);

  const getAsyncValueFn = useCallback(
    () => getAsyncValue(valueProp, defaultOptions, loadLabel),
    [valueProp, defaultOptions, loadLabel]
  );

  const { data: value, isFetching: isLoadingValue } = useQuery(
    ['getAsyncSelectValue', valueProp, defaultOptions, loadLabel],
    getAsyncValueFn,
    { enabled: Boolean(valueProp), ...LONG_CACHE_QUERY_OPTIONS }
  );

  return (
    <ReactAsyncSelect
      {...getDefaultProps(t)}
      isDisabled={
        disabled ||
        _.isUndefined(props?.loadOptions) ||
        isLoading ||
        isLoadingValue
      }
      placeholder={t('yleiset.kirjoitaHakusana')}
      noOptionsMessage={() => t('yleiset.eiValittaviaKohteitaHakusanalla')}
      defaultOptions={defaultOptions}
      styles={getStyles(theme, error)}
      theme={getTheme(theme)}
      cacheOptions={true}
      value={value ?? ''}
      isLoading={isLoading || isLoadingValue}
      inputId={id}
      {...props}
    />
  );
};

export default Select;
