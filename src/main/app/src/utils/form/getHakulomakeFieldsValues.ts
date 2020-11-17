import { HAKULOMAKETYYPPI } from '#/src/constants';

const getHakulomakeFieldsValues = ({
  hakulomaketyyppi,
  hakulomakeAtaruId,
  hakulomakeLinkki,
  hakulomakeKuvaus,
}): HakulomakeFormSection => {
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
