import { HAKULOMAKETYYPPI } from '../constants';

const getHakulomakeFieldsValues = ({
  hakulomaketyyppi,
  hakulomakeAtaruId,
  hakulomakeLinkki,
  hakulomakeKuvaus,
}) => {
  return {
    tyyppi: hakulomaketyyppi,
    lomake: [HAKULOMAKETYYPPI.ATARU].includes(hakulomaketyyppi)
      ? {
          [hakulomaketyyppi]: { value: hakulomakeAtaruId || '' },
        }
      : {},
    linkki: hakulomakeLinkki || {},
    kuvaus: hakulomakeKuvaus || {},
  };
};

export default getHakulomakeFieldsValues;
