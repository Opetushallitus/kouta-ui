import { get, pick } from 'lodash';

import { HAKULOMAKETYYPPI } from '../constants';

const getHakulomakeFieldsData = ({ hakulomakeValues, kielivalinta }) => {
  const hakulomaketyyppi = get(hakulomakeValues, 'tyyppi') || null;

  const hakulomakeAtaruId =
    hakulomaketyyppi === HAKULOMAKETYYPPI.ATARU
      ? get(hakulomakeValues, ['lomake', 'value']) || null
      : null;

  const hakulomakeLinkki =
    hakulomaketyyppi === HAKULOMAKETYYPPI.MUU
      ? pick(get(hakulomakeValues, 'linkki') || {}, kielivalinta)
      : {};

  const hakulomakeKuvaus =
    hakulomaketyyppi === HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA
      ? pick(get(hakulomakeValues, 'kuvaus') || {}, kielivalinta)
      : {};

  return {
    hakulomaketyyppi,
    hakulomakeAtaruId,
    hakulomakeLinkki,
    hakulomakeKuvaus,
  };
};

export default getHakulomakeFieldsData;
