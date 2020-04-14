import React, { createElement, useContext } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import FormConfigSectionContext from '#/src/components/FormConfigSectionContext';
import FormControl from '#/src/components/FormControl';
import useFormConfig from '#/src/components/useFormConfig';

const withoutLang = name => {
  const parts = _.split(name, '.');
  if (['fi', 'sv', 'en'].includes(_.last(parts))) {
    return _.dropRight(parts, 1).join('.');
  }
  return name;
};

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

    const formConfig = useFormConfig();
    const section = useContext(FormConfigSectionContext);

    const sectionFields = _.get(formConfig, `sections[${section}].fields`);

    const fieldConfig = _.find(
      sectionFields,
      f => f.formFieldName === withoutLang(name),
    );
    const required = _.get(fieldConfig, 'required');

    return (
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
    );
  };

  InputComponent.displayName = `FormField${Component.name}`;

  return InputComponent;
};
