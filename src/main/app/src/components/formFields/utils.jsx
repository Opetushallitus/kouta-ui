import React, { createElement } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import FormControl from '#/src/components/FormControl';
import FormHelperText from '#/src/components/FormHelperText';
import {
  useFieldConfig,
  useFieldIsRequired,
} from '#/src/hooks/fieldConfigHooks';
import { otherwise } from '#/src/utils';

export const createComponent = (Component, mapProps) => {
  const InputComponent = props => {
    const {
      disabled,
      label = '',
      helperText: helperTextProp,
      meta,
      input: { name },
    } = props;

    const { t } = useTranslation();

    const { error } = meta;
    const isError = !_.isNil(error);
    const children = createElement(Component, mapProps(props));

    const fieldConfig = useFieldConfig(name);
    const required = useFieldIsRequired(fieldConfig);

    const errors = _.isArray(error) ? error : [error];

    const HelperText = () => (
      <>
        {helperTextProp && <FormHelperText>{helperTextProp}</FormHelperText>}
        {isError &&
          errors.map(e => (
            <FormHelperText key={_.uniqueId()} error>
              {_.cond([
                [_.isFunction, f => f(t)],
                [otherwise, t],
              ])(e)}
            </FormHelperText>
          ))}
      </>
    );

    return fieldConfig ? (
      <FormControl
        error={isError}
        helperText={<HelperText />}
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
