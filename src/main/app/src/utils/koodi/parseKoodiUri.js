import isKoodiUri from './isKoodiUri';

const parseKoodiUri = value => {
  if (!isKoodiUri(value)) {
    return { koodiArvo: null, koodisto: null, koodi: null, versio: null };
  }

  const [koodi, versio] = value.split('#');

  const [koodisto, koodiArvo] = koodi.split('_');

  return {
    koodiArvo,
    koodisto,
    koodi,
    versio,
  };
};

export default parseKoodiUri;
