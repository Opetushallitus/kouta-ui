import { HAKULOMAKETYYPPI } from '../constants';

const getHakulomakeFieldsValues = ({
  hakulomaketyyppi,
  hakulomakeAtaruId,
  hakulomakeLinkki,
  hakulomakeKuvaus,
}) => {
  return {
    tyyppi: hakulomaketyyppi,
    lomake:
      hakulomaketyyppi === HAKULOMAKETYYPPI.ATARU
        ? { value: hakulomakeAtaruId || '' }
        : {},
    linkki: hakulomakeLinkki || {},
    kuvaus: hakulomakeKuvaus || {},
  };
};

export default getHakulomakeFieldsValues;
