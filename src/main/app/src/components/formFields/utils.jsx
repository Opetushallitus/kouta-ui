import React, { createElement } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import FormControl from '#/src/components/FormControl';
import {
  useFieldConfig,
  useFieldIsRequired,
} from '#/src/hooks/fieldConfigHooks';

export const createComponent = (Component, mapProps) => {
  const InputComponent = props => {
    const {
      disabled,
      label = '',
      helperText,
      meta,
      input: { name },
    } = props;

    const { error } = meta;
    const { t } = useTranslation();
    const children = createElement(Component, mapProps(props));

    const fieldConfig = useFieldConfig(name);
    const required = useFieldIsRequired(fieldConfig);

    return fieldConfig ? (
      <FormControl
        error={!_.isNil(error)}
        helperText={
          error ? (_.isArray(error) ? t(...error) : t(error)) : helperText
        }
        label={`${label}${required ? ' *' : ''}`}
        disabled={disabled}
      >
        {children}
      </FormControl>
    ) : (
      <div></div>
    );
  };

  InputComponent.displayName = `FormField${Component.name}`;

  return InputComponent;
};
