import get from 'lodash/get';

import { isFunction } from './index';
import createErrorBuilder from './createErrorBuilder';

const getErrorBuilderByFormConfig = (config, values) => {
  const sections = get(config, 'sections') || {};

  return Object.entries(sections)
    .flatMap(([, value]) => {
      const fields = get(value, 'fields') || {};

      return Object.entries(fields);
    })
    .reduce((acc, [, value]) => {
      const validate = get(value, 'validate');

      return isFunction(validate) ? validate(acc, values, config) : acc;
    }, createErrorBuilder(values));
};

export default getErrorBuilderByFormConfig;
