import get from 'lodash/get';
import pick from 'lodash/pick';

import { HAKULOMAKETYYPPI } from '../constants';

const getHakulomakeFieldsData = ({ hakulomakeValues, kielivalinta }) => {
  const hakulomaketyyppi = get(hakulomakeValues, 'tyyppi') || null;

  const hakulomakeId = [HAKULOMAKETYYPPI.ATARU].includes(hakulomaketyyppi)
    ? get(hakulomakeValues, ['lomake', hakulomaketyyppi, 'value']) || null
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
    hakulomakeAtaruId: hakulomakeId,
    hakulomakeLinkki,
    hakulomakeKuvaus,
  };
};

export default getHakulomakeFieldsData;
