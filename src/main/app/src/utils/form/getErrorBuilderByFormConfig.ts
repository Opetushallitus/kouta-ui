import _ from 'lodash';

import createErrorBuilder from './createErrorBuilder';

const getErrorBuilderByFormConfig = (config, values) => {
  const sections = _.get(config, 'sections') || {};

  return Object.entries(sections)
    .flatMap(([, value]) => {
      const fields = _.get(value, 'fields') || {};

      return Object.entries(fields);
    })
    .reduce((acc, [, value]) => {
      const validate = _.get(value, 'validate');

      return _.isFunction(validate) ? validate(acc, values, config) : acc;
    }, createErrorBuilder(values));
};

export default getErrorBuilderByFormConfig;
