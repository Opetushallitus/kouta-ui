import { isString } from './index';

const koodiUriHasVersion = koodiUri => {
  return isString(koodiUri) && /#[0-9]+$/.test(koodiUri);
};

export default koodiUriHasVersion;
