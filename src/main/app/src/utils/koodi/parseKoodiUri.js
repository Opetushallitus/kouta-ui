import isKoodiUri from './isKoodiUri';

const parseKoodiUri = value => {
  if (!isKoodiUri(value)) {
    return { koodisto: null, koodi: null, versio: null };
  }

  const [koodi, versio] = value.split('#');

  const [koodisto] = koodi.split('_');

  return {
    koodisto,
    koodi,
    versio,
  };
};

export default parseKoodiUri;
