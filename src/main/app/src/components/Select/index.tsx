import { useMemo, useContext, useCallback } from 'react';

import UiSelect, {
  getStyles,
  getTheme,
} from '@opetushallitus/virkailija-ui-components/Select';
import { useQuery } from '@tanstack/react-query';
import { TFunction } from 'i18next';
import { identity, isObject, isUndefined, reduce } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { components, Props } from 'react-select';
import ReactAsyncSelect from 'react-select/async';
import ReactAsyncCreatableSelect from 'react-select/async-creatable';
import ReactCreatable from 'react-select/creatable';
import styled, { ThemeContext } from 'styled-components';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { valueToArray, safeArrayToValue } from '#/src/utils';

import { Button } from '../virkailija';

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

const makeDefaultNoOptionsMessage = (t: TFunction) => () =>
  t('yleiset.eiValittaviaKohteita');

const makeDefaultFormatCreateLabel = (t: TFunction) => (value: string) =>
  t('yleiset.luoKohde', { kohde: value });

const makeDefaultPlaceholder = (t: TFunction) =>
  t('yleiset.valitseVaihtoehdoista');

const defaultLoadingMessage = (t: TFunction) => () => t('yleiset.ladataan');

const buildDefaultProps = (t: TFunction) => ({
  isClearable: true,
  formatCreateLabel: makeDefaultFormatCreateLabel(t),
  noOptionsMessage: makeDefaultNoOptionsMessage(t),
  placeholder: makeDefaultPlaceholder(t),
  loadingMessage: defaultLoadingMessage(t),
  className: 'Select__',
  components: {
    Option: OptionComponent,
  },
});

const getOptionLabelByValue = (
  options: SelectOptions = []
): Record<string, string> =>
  reduce(
    options,
    (acc, curr) => {
      acc[curr?.value || '_'] = curr?.label || curr?.value;
      return acc;
    },
    {}
  );

const getAsyncValue = async (
  value?: SelectOption | SelectOptions | null,
  options?: SelectOptions,
  loadLabel: (value?: string) => unknown = identity
) => {
  const newValue = valueToArray(getValue(value, options));
  const result = await Promise.all(
    newValue.map(async singleValue => ({
      ...singleValue,
      label:
        singleValue?.label === singleValue?.value
          ? ((await Promise.resolve(loadLabel(singleValue?.value)).catch(
              () => undefined
            )) ?? singleValue?.value)
          : singleValue?.label,
    }))
  );

  return safeArrayToValue(result);
};

const getValue = (
  value?: SelectOption | SelectOptions | null,
  options?: SelectOptions
) => {
  const labelByValue = getOptionLabelByValue(options);
  if (Array.isArray(value)) {
    const newValue: SelectOptions = [];

    for (const item of value) {
      if (isObject(item) && item.value) {
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
    () => getValue(value, options),
    [value, options]
  );

  const { t } = useTranslation();
  const defaultProps = useMemo(() => buildDefaultProps(t), [t]);

  return (
    <UiSelect
      {...defaultProps}
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
  const defaultProps = useMemo(() => buildDefaultProps(t), [t]);

  return (
    <ReactCreatable
      {...defaultProps}
      styles={getStyles(theme, error)}
      theme={getTheme(theme)}
      inputId={id}
      isDisabled={disabled}
      {...props}
    />
  );
};

const StyledButton = styled(Button)`
  margin-left: auto;
`;

const OptionWithCreateButton = props => {
  const { t } = useTranslation();

  const onClick = () => {
    props.selectOption(props.data);
  };

  const innerProps = {
    ...props.innerProps,
    onClick: null,
  };

  const { value } = props.data;

  if (props.data.__isNew__) {
    return (
      <components.Option {...props} innerProps={innerProps}>
        {value}
        <StyledButton onClick={onClick}>
          {t('yleiset.lisaaUusi', { kohde: 'avainsana' })}
        </StyledButton>
      </components.Option>
    );
  }
  return <components.Option {...props}>{props.children}</components.Option>;
};

export const AsyncCreatableSelect = ({
  error = false,
  id,
  disabled,
  ...props
}) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const defaultProps = useMemo(() => buildDefaultProps(t), [t]);

  return (
    <ReactAsyncCreatableSelect
      {...defaultProps}
      placeholder={t('yleiset.kirjoitaHakusana')}
      styles={{
        ...getStyles(theme, error),
        option: baseStyles => ({
          ...baseStyles,
          display: 'flex',
          alignItems: 'center',
        }),
      }}
      theme={getTheme(theme)}
      cacheOptions={true}
      inputId={id}
      isDisabled={disabled}
      {...props}
      components={{ Option: OptionWithCreateButton }}
      createOptionPosition="first"
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
  const defaultProps = useMemo(() => buildDefaultProps(t), [t]);

  const getAsyncValueFn = useCallback(
    () => getAsyncValue(valueProp, defaultOptions, loadLabel),
    [valueProp, defaultOptions, loadLabel]
  );

  const { data: value, isFetching: isLoadingValue } = useQuery({
    queryKey: ['getAsyncSelectValue', valueProp, defaultOptions, loadLabel],
    queryFn: getAsyncValueFn,
    enabled: Boolean(valueProp),
    ...LONG_CACHE_QUERY_OPTIONS,
  });

  return (
    <ReactAsyncSelect
      {...defaultProps}
      isDisabled={
        disabled ||
        isUndefined(props?.loadOptions) ||
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
