import React, { createElement, useContext } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import FormConfigSectionContext from '#/src/components/FormConfigSectionContext';
import FormControl from '#/src/components/FormControl';
import useFormConfig from '#/src/components/useFormConfig';

const findFieldConfig = (fieldConfigs = [], name) => {
  const trimmedFieldName = name.replace(/\[\d\]/, '');
  const fieldNameParts = _.split(trimmedFieldName, '.');
  let configFound = null;
  let nameCandidate = null;
  _.forEach(fieldNameParts, value => {
    nameCandidate = nameCandidate ? `${nameCandidate}.${value}` : value;
    if (fieldConfigs[nameCandidate]) {
      configFound = fieldConfigs[nameCandidate];
    }
  });
  return configFound;
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
    const sectionFields = _.get(formConfig, `sections.${section}.fields`);

    const fieldConfig = findFieldConfig(sectionFields, name);
    const required = _.get(fieldConfig, 'required');

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
