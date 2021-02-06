import _ from 'lodash';

const koodiUriHasVersion = koodiUri => {
  return _.isString(koodiUri) && /#[0-9]+$/.test(koodiUri);
};

export default koodiUriHasVersion;
