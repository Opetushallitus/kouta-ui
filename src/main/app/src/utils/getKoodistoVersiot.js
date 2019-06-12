import { isString, isArray, isObject } from './index';
import parseKoodiUri from './parseKoodiUri';

const getKoodistoVersiot = (value, versiot = {}) => {
  if (isString(value)) {
    const { koodisto, versio } = parseKoodiUri(value);

    return koodisto !== null && versio !== null ? { [koodisto]: versio } : {};
  }

  if (isObject(value)) {
    return {
      ...versiot,
      ...Object.keys(value).reduce((acc, curr) => {
        acc = { ...acc, ...getKoodistoVersiot(value[curr], versiot) };

        return acc;
      }, {}),
    };
  }

  if (isArray(value)) {
    return {
      ...versiot,
      ...value.reduce((acc, curr) => {
        acc = { ...acc, ...getKoodistoVersiot(curr, versiot) };

        return acc;
      }, {}),
    };
  }

  return {};
};

export default getKoodistoVersiot;
