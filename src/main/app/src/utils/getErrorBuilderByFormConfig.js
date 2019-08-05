import get from 'lodash/get';

import { isFunction } from './index';
import createErrorBuilder from '../createErrorBuilder';

const getErrorBuilderByFormConfig = (config, values) => {
  const fields = get(config, 'fields') || {};

  return Object.entries(fields).reduce((acc, [, value]) => {
    const validate = get(value, 'validate');

    return isFunction(validate) ? validate(acc, values) : acc;
  }, createErrorBuilder(values));
};

export default getErrorBuilderByFormConfig;
