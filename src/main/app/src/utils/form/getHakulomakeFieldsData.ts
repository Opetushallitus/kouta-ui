import { get } from 'lodash';

import { HAKULOMAKETYYPPI } from '#/src/constants';

export const getHakulomakeFieldsData = ({
  hakulomakeValues,
  kieleistykset,
  kieleistyksetSerialized,
}) => {
  const hakulomaketyyppi = get(hakulomakeValues, 'tyyppi') || null;

  const hakulomakeAtaruId =
    hakulomaketyyppi === HAKULOMAKETYYPPI.ATARU
      ? get(hakulomakeValues, 'lomake.value') || null
      : null;

  const hakulomakeLinkki =
    hakulomaketyyppi === HAKULOMAKETYYPPI.MUU
      ? kieleistykset(get(hakulomakeValues, 'linkki'))
      : {};

  const hakulomakeKuvaus =
    hakulomaketyyppi === HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA
      ? kieleistyksetSerialized(get(hakulomakeValues, 'kuvaus'))
      : {};

  return {
    hakulomaketyyppi,
    hakulomakeAtaruId,
    hakulomakeLinkki,
    hakulomakeKuvaus,
  };
};
