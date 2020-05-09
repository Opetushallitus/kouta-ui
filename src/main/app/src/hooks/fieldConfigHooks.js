import { useContext } from 'react';
import _ from 'lodash';
import FormConfigSectionContext from '#/src/components/FormConfigSectionContext';
import { useFormConfig, useForm } from '#/src/hooks/form';

const findFieldConfig = (fieldConfigs = [], name = '') => {
  const trimmedFieldName = name.replace(/\[\d\]/, '');
  const fieldNameParts = _.split(trimmedFieldName, '.').filter(
    part => !/#\d+$/.test(part)
  );
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

export function useFieldConfig(name) {
  const formConfig = useFormConfig();
  const section = useContext(FormConfigSectionContext);
  const sectionFields = _.get(formConfig, `sections.${section}.fields`);
  return findFieldConfig(sectionFields, name);
}

export function useFieldIsRequired(fieldConfig) {
  const form = useForm();
  const required = _.get(fieldConfig, 'required');
  return _.isFunction(required) ? required(_.get(form, 'values')) : required;
}
