import { isString } from 'lodash-es';

const koodiUriHasVersion = koodiUri => {
  return isString(koodiUri) && /#[0-9]+$/.test(koodiUri);
};

export default koodiUriHasVersion;
