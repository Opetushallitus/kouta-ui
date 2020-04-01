import { isString, isEmpty } from 'lodash';

const parseParentOids = parentOidPathString =>
  isString(parentOidPathString)
    ? parentOidPathString.split('/').filter(oid => !isEmpty(oid))
    : [];

export default parseParentOids;
