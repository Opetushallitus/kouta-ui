import { HAKULOMAKETYYPPI } from '../constants';

const getHakulomakeFieldsValues = ({
  hakulomaketyyppi,
  hakulomakeId,
  hakulomakeLinkki,
  hakulomakeKuvaus,
}) => {
  return {
    tyyppi: hakulomaketyyppi,
    lomake: [HAKULOMAKETYYPPI.ATARU].includes(hakulomaketyyppi)
      ? {
          [hakulomaketyyppi]: { value: hakulomakeId || '' },
        }
      : {},
    linkki: hakulomakeLinkki || {},
    kuvaus: hakulomakeKuvaus || {},
  };
};

export default getHakulomakeFieldsValues;
